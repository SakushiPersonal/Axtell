import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']

// Hook para propiedades
export function useProperties() {
  const [properties, setProperties] = useState<Tables['properties']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agents (
            id,
            name,
            email,
            phone,
            whatsapp_number
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching properties')
    } finally {
      setLoading(false)
    }
  }

  const createProperty = async (property: Tables['properties']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single()

      if (error) throw error
      await fetchProperties() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error creating property')
    }
  }

  const updateProperty = async (id: string, updates: Tables['properties']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchProperties() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error updating property')
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error
      await fetchProperties() // Refrescar lista
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error deleting property')
    }
  }

  const incrementViews = async (propertyId: string) => {
    try {
      await supabase.rpc('increment_property_views', { property_id: propertyId })
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    incrementViews
  }
}

// Hook para solicitudes de visita
export function useVisitRequests() {
  const [visitRequests, setVisitRequests] = useState<Tables['visit_requests']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVisitRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('visit_requests')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            neighborhood,
            city
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVisitRequests(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching visit requests')
    } finally {
      setLoading(false)
    }
  }

  const createVisitRequest = async (visitRequest: Tables['visit_requests']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('visit_requests')
        .insert(visitRequest)
        .select()
        .single()

      if (error) throw error
      await fetchVisitRequests() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error creating visit request')
    }
  }

  const updateVisitStatus = async (id: string, status: Tables['visit_requests']['Row']['status'], notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('visit_requests')
        .update({ status, notes })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchVisitRequests() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error updating visit status')
    }
  }

  useEffect(() => {
    fetchVisitRequests()
  }, [])

  return {
    visitRequests,
    loading,
    error,
    refetch: fetchVisitRequests,
    createVisitRequest,
    updateVisitStatus
  }
}

// Hook para solicitudes de tasación
export function useAppraisalRequests() {
  const [appraisalRequests, setAppraisalRequests] = useState<Tables['appraisal_requests']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppraisalRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('appraisal_requests')
        .select(`
          *,
          agents (
            id,
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAppraisalRequests(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching appraisal requests')
    } finally {
      setLoading(false)
    }
  }

  const createAppraisalRequest = async (appraisalRequest: Tables['appraisal_requests']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('appraisal_requests')
        .insert(appraisalRequest)
        .select()
        .single()

      if (error) throw error
      await fetchAppraisalRequests() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error creating appraisal request')
    }
  }

  const updateAppraisalStatus = async (
    id: string, 
    status: Tables['appraisal_requests']['Row']['status'],
    estimatedValue?: number,
    notes?: string,
    assignedTo?: string
  ) => {
    try {
      const updates: Tables['appraisal_requests']['Update'] = { status }
      if (estimatedValue !== undefined) updates.estimated_value = estimatedValue
      if (notes !== undefined) updates.notes = notes
      if (assignedTo !== undefined) updates.assigned_to = assignedTo

      const { data, error } = await supabase
        .from('appraisal_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchAppraisalRequests() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error updating appraisal status')
    }
  }

  useEffect(() => {
    fetchAppraisalRequests()
  }, [])

  return {
    appraisalRequests,
    loading,
    error,
    refetch: fetchAppraisalRequests,
    createAppraisalRequest,
    updateAppraisalStatus
  }
}

// Hook para agentes
export function useAgents() {
  const [agents, setAgents] = useState<Tables['agents']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setAgents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching agents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents
  }
}

// Hook para perfiles de usuario
export function useUserProfiles() {
  const [userProfiles, setUserProfiles] = useState<Tables['user_profiles']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserProfiles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserProfiles(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching user profiles')
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async (profile: Tables['user_profiles']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single()

      if (error) throw error
      await fetchUserProfiles() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error creating user profile')
    }
  }

  const updateUserProfile = async (id: string, updates: Tables['user_profiles']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchUserProfiles() // Refrescar lista
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error updating user profile')
    }
  }

  const deleteUserProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error
      await fetchUserProfiles() // Refrescar lista
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error deleting user profile')
    }
  }

  useEffect(() => {
    fetchUserProfiles()
  }, [])

  return {
    userProfiles,
    loading,
    error,
    refetch: fetchUserProfiles,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile
  }
}