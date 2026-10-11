// Splits affected unit-test globs by the Nx project that owns them. `projects/docs/**` specs
// belong to the docs project; every other spec belongs to the ui library.

export function splitByProject(globs) {
  const ui = [];
  const docs = [];
  for (const glob of globs) {
    (glob.startsWith('projects/docs/') ? docs : ui).push(glob);
  }
  return { ui, docs };
}
