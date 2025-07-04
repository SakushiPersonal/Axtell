import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, role?: 'client' | 'vendedor' | 'captador' | 'admin') => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isCaptador: boolean
  isVendedor: boolean
  isSuperAdmin: boolean
  hasPermission: (permission: 'properties' | 'clients' | 'appraisals' | 'visits' | 'users' | 'analytics') => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error.message)
        setUserProfile(null)
      } else {
        console.log('User profile fetched:', data)
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error.message)
      } else {
        console.log('Sign in successful')
      }
      
      return { error }
    } catch (err) {
      console.error('Unexpected sign in error:', err)
      return { error: err }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: 'client' | 'vendedor' | 'captador' | 'admin' = 'client') => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin'
  const isCaptador = userProfile?.role === 'captador'
  const isVendedor = userProfile?.role === 'vendedor'
  const isSuperAdmin = userProfile?.role === 'super_admin'

  const hasPermission = (permission: 'properties' | 'clients' | 'appraisals' | 'visits' | 'users' | 'analytics') => {
    if (!userProfile || !userProfile.is_active) return false
    
    const role = userProfile.role
    
    switch (permission) {
      case 'properties':
        return ['admin', 'super_admin', 'captador'].includes(role) || 
               (role === 'vendedor') // vendedores pueden ver pero no editar
      case 'clients':
        return ['admin', 'super_admin', 'vendedor'].includes(role)
      case 'appraisals':
        return ['admin', 'super_admin', 'captador'].includes(role)
      case 'visits':
        return ['admin', 'super_admin', 'vendedor'].includes(role)
      case 'users':
        return ['admin', 'super_admin'].includes(role)
      case 'analytics':
        return ['admin', 'super_admin'].includes(role)
      default:
        return false
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isCaptador,
    isVendedor,
    isSuperAdmin,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}