# Facade

- the facade works as a unique interface to access the fetcher decoder and filter
- it works similarly to the filter, the main difference is that:
  - on construction it always calls the fetcher, retrieveing the services with http call and decoding them into objects to construct the filter
  - if the deselection returns an empty list of services the action i reversed and it returns false, signaling the item isn't deselectable, since it would make the list empty
