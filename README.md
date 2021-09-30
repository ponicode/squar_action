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
    userToken: ${{ secrets.PONICODE_SQUAR_TOKEN }},
    impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }},
    branch: ${GITHUB_REF##*/}
```

Once the docstrings are written, use the [create pull request action](https://github.com/peter-evans/create-pull-request) to see the results in the branch of your choice

```yaml
- name: Create Pull Request
  uses: peter-evans/create-pull-request@v3
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    commit-message: "[ponicode-pull-request] Ponicode found Unit-Tests to bootstrap!"
    branch: ponicode-ut
    title: "[Ponicode] Ponicode Unit-Tests bootstrap"
    body: |
      Ponicode Unit-Tests bootstrap for branch ${GITHUB_REF##*/}
      ${{ steps.ponicode.outputs.ponicodeSummary }}
```