'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Project, PaginatedResponse, FilterParams } from '@/types'

export function useProjects(initialParams: FilterParams = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalPages: 0,
    count: 0,
  })
  const [params, setParams] = useState<FilterParams>(initialParams)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/projects?${new URLSearchParams({
        page: params.page?.toString() || '1',
        pageSize: params.pageSize?.toString() || '12',
        search: params.search || '',
        sortBy: params.sortBy || 'order_index',
        sortOrder: params.sortOrder || 'asc',
        status: params.status || '',
        category: params.category || '',
        featured: params.featured?.toString() || '',
      })}`)
      
      if (!response.ok) throw new Error('Failed to fetch projects')
      
      const data: PaginatedResponse<Project> = await response.json()
      setProjects(data.data)
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        count: data.count,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const updateParams = (newParams: Partial<FilterParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }))
  }

  const goToPage = (page: number) => {
    setParams(prev => ({ ...prev, page }))
  }

  return {
    projects,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    refetch: fetchProjects,
  }
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/projects/${slug}`)
        if (!response.ok) throw new Error('Project not found')
        const data = await response.json()
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProject()
  }, [slug])

  return { project, loading, error }
}