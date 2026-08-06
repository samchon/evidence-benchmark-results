# Frontend screen plan

## Operations workbench

- Requirement: REQ-NFR-DELIVERY-003, typed consumers can invoke the published SDK surface.
- Actor: an authenticated ERP operator with the authority required by the selected command.
- Operations: every generated accessor is wrapped by one domain hook and exposed through the searchable command list.
- Journey: open the workbench, search for an operation, inspect its argument contract, submit a JSON argument list, and observe success or an inline refusal.
- States: restoring shell, empty search, filtered empty, command pending, malformed JSON, server refusal, unexpected error, and successful response.

The workbench is the shared boundary for the generated operation surface. Domain screens can compose the same hooks without introducing another transport layer.
