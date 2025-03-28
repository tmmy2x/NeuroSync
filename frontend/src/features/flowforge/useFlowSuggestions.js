import { useEffect, useState } from 'react'
import { getFlowSuggestions } from './flowApi'

export function useFlowSuggestions() {
  const [data, setData] = useState([])

  useEffect(() => {
    getFlowSuggestions().then(setData)
  }, [])

  return data
}
