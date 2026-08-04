# Electrical data notes

The version-controlled JSON files are application inputs, not executable source.
They are parsed through Zod in `src/services` before the application consumes
them.

## Sources

Country socket types, nominal domestic voltages, and frequencies were reviewed
against the [World Standards country table](https://www.worldstandards.eu/electricity/plug-voltage-by-country/),
including its dedicated notes for countries with regional differences. Plug
descriptions and representative ratings were reviewed against the corresponding
[plug and socket type guides](https://www.worldstandards.eu/electricity/plugs-and-sockets/).
The international catalogue of standardized domestic systems is described by
[IEC/TR 60083](https://webstore.iec.ch/en/publication/665).

Last reviewed: 2026-08-04.

## Modelling decisions

- `voltages` and `frequencies` are arrays because a single value would be
  misleading for countries such as Brazil and Japan.
- Type O is included so Thailand is not represented with an incomplete socket
  list, even though the original product brief listed only Types A–N.
- Plug-to-country relationships are derived from country records rather than
  duplicated in `plugs.json`.
- `imageKey` is a stable future asset identifier. Phase 2 does not introduce
  plug artwork or broken asset paths.
- Device profiles are general educational guidance. The exact rating label and
  manufacturer instructions remain authoritative for an individual device.
