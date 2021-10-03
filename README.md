# Setup

## Existing workflow

Add the following lines to any of your Github Action workflow

```yaml
- id: get_changed_files
    uses: jitterbit/get-changed-files@v1
    with:
      format: 'json'
- uses: ponicode/ponicode-squar-action@master
  with:
    repoURL: ${{github.repository}},
    ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }},
    impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }},
    branch: ${GITHUB_REF##*/},
    githubToken: ${{ secrets.GITHUB_TOKEN }}
```