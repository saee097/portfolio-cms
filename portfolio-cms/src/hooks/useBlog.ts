'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BlogPost, BlogPostWithRelations, PaginatedResponse, FilterParams } from '@/types'

export function useBlogPosts(initialParams: FilterParams = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 0,
    count: 0,
  })
  const [params, setParams] = useState<FilterParams>(initialParams)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/blog?${new URLSearchParams({
        page: params.page?.toString() || '1',
        pageSize: params.pageSize?.toString() || '10',
        search: params.search || '',
        sortBy: params.sortBy || 'published_at',
        sortOrder: params.sortOrder || 'desc',
        status: params.status || '',
        category: params.category || '',
      })}`)
      
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      
      const data: PaginatedResponse<BlogPost> = await response.json()
      setPosts(data.data)
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
    fetchPosts()
  }, [fetchPosts])

  const updateParams = (newParams: Partial<FilterParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }))
  }

  const goToPage = (page: number) => {
    setParams(prev => ({ ...prev, page }))
  }

  return {
    posts,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    refetch: fetchPosts,
  }
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPostWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/blog/${slug}`)
        if (!response.ok) throw new Error('Post not found')
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchPost()
  }, [slug])

  return { post, loading, error }
}