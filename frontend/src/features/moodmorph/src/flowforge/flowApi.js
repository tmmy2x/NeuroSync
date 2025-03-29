export async function getFlowSuggestions() {
    const res = await fetch('http://localhost:8000/api/flow/suggest')
    const data = await res.json()
    return data.suggestions || []
  }
  