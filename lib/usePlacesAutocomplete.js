import { useCallback, useEffect, useRef, useState } from 'react'

// additional config goes here.
// If you need it configurable at runtime then you could take in opts as an arg
// to the hook and merge with the default
let opts = { componentRestrictions: { country: 'us' } }

export function usePlacesAutocomplete() {
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteService = useRef();

  useEffect(() => {
    autocompleteService.current = new google.maps.places.autocompleteService();
  }, []);

  const getSuggestions = useCallback((input) => {
    autocompleteService.current.getPlacePredictions({ input: input, ...opts }, response => {
      // it's asynchronous but for some reason they decided to use node-style callbacks instead of promises
      setSuggestions(response);
    });
  }, []);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  return {
    suggestions,
    getSuggestions,
    clearSuggestions,
  }
}
