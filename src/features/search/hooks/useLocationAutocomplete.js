import axios from 'axios'
import { useEffect, useState } from 'react'
import { searchLocations } from '../../../services/locationIqService'

const minimumQueryLength = 3
const debounceDelay = 400

function useLocationAutocomplete({ initialLocation = null, onSelectionChange }) {
  const [inputText, setInputText] = useState(
    initialLocation?.displayAddress || '',
  )
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [suggestions, setSuggestions] = useState([])
  const [status, setStatus] = useState('idle')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const query = inputText.trim()

    if (selectedLocation?.displayAddress === inputText) {
      return undefined
    }

    if (query.length < minimumQueryLength) {
      return undefined
    }

    const controller = new AbortController()
    const debounceTimer = window.setTimeout(async () => {
      setStatus('loading')
      setIsOpen(true)

      try {
        const results = await searchLocations(query, {
          signal: controller.signal,
        })
        setSuggestions(results)
        setStatus(results.length ? 'success' : 'empty')
      } catch (error) {
        if (axios.isCancel(error) || error.name === 'CanceledError') return
        setSuggestions([])
        setStatus('error')
      }
    }, debounceDelay)

    return () => {
      window.clearTimeout(debounceTimer)
      controller.abort()
    }
  }, [inputText, selectedLocation])

  const updateInputText = (value) => {
    setInputText(value)
    setIsOpen(value.trim().length >= minimumQueryLength)

    if (value.trim().length < minimumQueryLength) {
      setSuggestions([])
      setStatus('idle')
    }

    if (selectedLocation) {
      setSelectedLocation(null)
      onSelectionChange(null)
    }
  }

  const selectLocation = (location) => {
    setSelectedLocation(location)
    setInputText(location.displayAddress)
    setSuggestions([])
    setStatus('idle')
    setIsOpen(false)
    onSelectionChange(location)
  }

  return {
    inputText,
    isOpen,
    selectedLocation,
    selectLocation,
    setIsOpen,
    status,
    suggestions,
    updateInputText,
  }
}

export default useLocationAutocomplete

