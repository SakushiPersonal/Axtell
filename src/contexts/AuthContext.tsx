import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabaseClient';
import { profileService } from '../supabase/database';
import { ProfileInsert } from '../types/database';
import { User } from '../types';
import { profileToUser } from '../utils/databaseConverters';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; role: 'admin' | 'vendedor' | 'captador'; phone?: string }) => Promise<{ success: boolean; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: any }>;
  createUserAsAdmin: (email: string, password: string, userData: { name: string; role: 'admin' | 'vendedor' | 'captador'; phone?: string }) => Promise<{ success: boolean; error?: any; user?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initializingRef = useRef(true);
  const creatingUserRef = useRef(false); // Bandera para prevenir cambios de sesión durante creación

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await profileService.getById(userId);
      
      if (profile) {
        // Verificar si el usuario está activo
        if (!profile.is_active) {
          await signOut();
          throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
        }
        
        setUser(profileToUser(profile));
      } else {
        console.log('⚠️ Perfil no encontrado, creando uno nuevo...');
        const { data: authUser } = await supabase.auth.getUser();
        
        if (authUser.user && authUser.user.email) {
          // Intentar usar metadata del usuario primero, luego fallback a defaults
          const userMetadata = authUser.user.user_metadata || {};
          
          const newProfileData = {
            id: userId,
            email: authUser.user.email,
            name: userMetadata.name || authUser.user.email.split('@')[0],
            role: userMetadata.role || (authUser.user.email === 'admin@axtell.com' ? 'admin' as const : 'vendedor' as const),
            phone: userMetadata.phone || '',
            is_active: true
          };
          
          console.log('📝 Creando perfil con metadata del usuario:', { 
            metadata: userMetadata, 
            profileData: newProfileData 
          });
          
          const newProfile = await profileService.create(newProfileData);
          console.log('✅ Nuevo perfil creado exitosamente con rol:', newProfile.role);
          setUser(profileToUser(newProfile));
        }
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
      // Si hay un error (incluido usuario inactivo), limpiar la sesión
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    console.log('📡 AuthProvider inicializando...');
    
    const initializeAuth = async () => {
      try {
        console.log('🔍 Obteniendo sesión inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('✅ Sesión inicial obtenida:', !!session, 'Error:', !!error);
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error);
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          
          if (session?.user) {
            console.log('📄 Sesión encontrada, cargando perfil...');
            await loadUserProfile(session.user.id);
          } else {
            console.log('ℹ️ No hay sesión activa');
          }
        }
      } catch (error) {
        console.error('❌ Error en inicialización:', error);
        setSession(null);
        setUser(null);
      } finally {
    
        setLoading(false);
        initializingRef.current = false;
      }
    };

    // Configurar listener de auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth change:', event, 'session:', !!session, 'initializing:', initializingRef.current, 'creatingUser:', creatingUserRef.current);
      
      // Solo procesar eventos si no estamos inicializando ni creando usuarios
      if (!initializingRef.current && !creatingUserRef.current) {
        setSession(session);
        
        if (!session) {
          console.log('🚪 Usuario deslogueado');
          setUser(null);
        } else if (event === 'SIGNED_IN' && session.user) {
          console.log('🔑 Nuevo login detectado, cargando perfil...');
          await loadUserProfile(session.user.id);
        }
      } else {
        console.log('⏭️ Ignorando evento durante inicialización o creación de usuario');
      }
    });

    // Ejecutar inicialización
    initializeAuth();

    return () => {
      console.log('🧹 Limpiando AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    userData: { name: string; role: 'admin' | 'vendedor' | 'captador'; phone?: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        const profileData: ProfileInsert = {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          is_active: true
        };
        await profileService.create(profileData);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      // ADVERTENCIA: Esta función debería usarse solo por administradores
      // Con RLS activado, solo admins podrán actualizar perfiles
      console.warn('⚠️ updateProfile llamado - verificar que solo admins usen esta función');

      const profileUpdates: any = {};
      if (updates.name) profileUpdates.name = updates.name;
      if (updates.phone) profileUpdates.phone = updates.phone;
      if (updates.role) profileUpdates.role = updates.role;

      const updatedProfile = await profileService.update(user.id, profileUpdates);
      setUser(profileToUser(updatedProfile));

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 SignIn:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // El perfil se cargará automáticamente por onAuthStateChange
      console.log('✅ Login exitoso, perfil se cargará automáticamente');
      return { success: true };
    } catch (error) {
      console.error('Error login:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const createUserAsAdmin = async (
    email: string, 
    password: string, 
    userData: { name: string; role: 'admin' | 'vendedor' | 'captador'; phone?: string }
  ) => {
    try {
      console.log('👨‍💼 [DEBUG] Iniciando creación de usuario:', { email, role: userData.role });
      
      // Activar bandera para prevenir cambios de sesión automáticos
      creatingUserRef.current = true;
      
      // Guardar la sesión actual del admin antes de crear el usuario
      const currentSession = session;
      const currentUser = user;
      
      // Paso 1: Crear usuario en auth.users
      console.log('🔐 [DEBUG] Llamando a supabase.auth.signUp...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            phone: userData.phone
          }
        }
      });

      console.log('📊 [DEBUG] Resultado de signUp:', { 
        hasUser: !!signUpData?.user, 
        userId: signUpData?.user?.id,
        error: signUpError 
      });

      if (signUpError) {
        console.error('❌ [DEBUG] Error en signUp:', signUpError);
        return { success: false, error: signUpError };
      }

      if (!signUpData?.user) {
        console.error('❌ [DEBUG] No se retornó usuario de signUp');
        return { success: false, error: { message: 'No se pudo crear el usuario en Supabase Auth' } };
      }

      // Paso 2: Hacer logout inmediatamente para restaurar sesión del admin
      console.log('🔄 [DEBUG] Haciendo logout para restaurar sesión del admin...');
      await supabase.auth.signOut();
      
      // Restaurar la sesión del admin manualmente
      setSession(currentSession);
      setUser(currentUser);

      // Paso 3: Intentar crear perfil manualmente
      console.log('👤 [DEBUG] Intentando crear perfil para usuario:', signUpData.user.id);
      
      try {
        const profileData: ProfileInsert = {
          id: signUpData.user.id,
          email: signUpData.user.email!,
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          is_active: true
        };

        console.log('📝 [DEBUG] Datos del perfil a crear:', profileData);
        
        const createdProfile = await profileService.create(profileData);
        
        console.log('✅ [DEBUG] Perfil creado exitosamente:', createdProfile.id);
        
        return { 
          success: true, 
          user: profileToUser(createdProfile) 
        };

      } catch (profileError) {
        console.warn('⚠️ [DEBUG] Error creando perfil:', profileError);
        
        // Si el perfil falló pero el usuario auth se creó, aún consideramos éxito parcial
        const basicUser: User = {
          id: signUpData.user.id,
          email: signUpData.user.email!,
          name: userData.name,
          role: userData.role,
          phone: userData.phone || '',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        console.log('🔄 [DEBUG] Retornando usuario básico sin perfil completo');
        return { success: true, user: basicUser };
      }

    } catch (generalError) {
      console.error('❌ [DEBUG] Error general en createUserAsAdmin:', generalError);
      return { 
        success: false, 
        error: generalError instanceof Error ? generalError : { message: 'Error desconocido' }
      };
    } finally {
      // Desactivar bandera al finalizar
      creatingUserRef.current = false;
      console.log('🏁 [DEBUG] Finalizando creación de usuario - bandera desactivada');
    }
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createUserAsAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export const UserAuth = useAuth; 