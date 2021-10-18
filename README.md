# 🦄 Grade your testing suite and automatically improve your code coverage!🦄
Ponicode SQUAR Action lets you know when your Pull-Request introduces not well / enough tested critical code, and automatically remediates to it with Unit-Tests. This permits to:
- Keep your critical code at a high level of coverage
- Avoid bugs on the critical part of your code

# What is a critical piece of code 🤔 ? 
Ponicode has developed a secret sauce to evaluate the criticity of a piece of code. Her are some definitions:

- __Criticity of a function__: this is a weighted sum of the complexity of repair (CR) of a function with the impact of the function on the code-base
- __Complexity of Repair__: Measure of how difficult a function is to intuitively understand and modify. This measure is between 0 and 1
- __Impact of a function on the code-base__: A measure between 0 and 1 that measures how much the function is used in the project


# How to setup this action

## If not exist, create a yaml workflow file in your project

Add the following lines to any of your Github Action workflow.

Go to the root of your project, and create the path to your workflow file. For example
```
mkdir -p .github/workflows
```
You can also just create a folder named ``.github``, in it create another folder named ``workflows``. You can now create a YAML file named **``ponicode.yml``** and copy one of the following example in it! <br />

## Existing workflow
Here is what you must add in your ```.github/workflows/ponicode.yml``` file to activate and use Ponicode Squar Action  to trigger the action.

```yaml
jobs:
  ponicode:
    runs-on: ubuntu-latest
    env:
      SQUAR_API_URL: "https://ponicode-glados-prod.azurewebsites.net"
      FETCH_REPORT_RETRY_MILLISEC: 5000
    steps:
    - uses: actions/checkout@v1
    - run: |
        npm install -g ponicode
  - id: get_changed_files
    uses: jitterbit/get-changed-files@v1
    continue-on-error: true
    with:
      format: 'json'
  - id: extract_branch
    if: github.event_name == 'pull_request'
    run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
  - uses: ponicode/ponicode-squar-action@master
    with:
      repoURL: ${{github.repository} # DO NOT MODIFY
      impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
      branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
      githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
      ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }}
      ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }}
      bootstrapUT: 'true'
      displayFullReport: 'true'
```
**As configured, this workflow does:**
1. grade the code that is contained into the created / update in the current PR, and lists the alerts (=functions introduced / updated in the PR that are not / not-well tested)
2. optionaly (if ```displayFullReport``` parameter is set to ```true```): display the SQUAR report for the whole project
3. optionaly (if ```bootstrapUT``` parameter is set to ```true```), bootstraps the (missing) Unit-Tests for the functions included into the PR into a dedicated PR.

## Ponicode SQUAR Action parameters
| Name | Description | Required | Default |
|------|-------------|----------|---------|
| ``bootstrapUT`` | Boolean: Set if missing Unit-Tests shall be automatically bootstraped by Ponicode (True) or not (False) | Yes | ``true`` |
| ``displayFullReport`` | Boolean: set if Ponicode SQUAR report on the whole project shall be displayed as for information in the PR comment (True), or not (False) | Yes |``true`` |
| ``ponicodeSquarToken`` | Secret token to be retrieved on [Ponicode SQUAR app](https://squar.ponicode.com) | Yes | No default. This parameter must be set-up in your GITHUB SECRETS (see below on how to do that) |
| ``ponicodeUtToken`` | Secret token to be retrieved on [Ponicode UT Generation App](https:/:app.ponicode.com) | Yes if ``bootstrapUT`` is set to ``true``, No if not | No default. This parameter must be set-up in your GITHUB SECRETS (see below on how to do that) |

**NB: all the other parameters must be let un-changed, since they are automatically filled-in from previous steps in the workflow**
- ``repoURL``
- ``impactedFiles``
- ``branch``
- ``githubToken``

**NB2: you can find the procedure on how to setup Github Secrets here**: [Github Secrets setup](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

# Use-Cases
Here are some examples of ```.github/workflows/ponicode.yml``` file to setup Ponicode SQUAR Action
### 1. Raises Tests Quality alerts and bootstrap remediation Unit-Tests on each created / updated PR. Also includes Ponicode SQUAR report for the whole project.
```yaml
name: "ponicode-ci"
on:
  pull_request:
    types: [ edited, synchronize ]  # rebuild any PRs and main branch changes

jobs:
  ponicode:
    runs-on: ubuntu-latest
    env:
      SQUAR_API_URL: "https://ponicode-glados-prod.azurewebsites.net"
      FETCH_REPORT_RETRY_MILLISEC: 5000
    steps:
    - uses: actions/checkout@v1
    - run: |
        npm install -g ponicode
  - id: get_changed_files
    uses: jitterbit/get-changed-files@v1
    continue-on-error: true
    with:
      format: 'json'
  - id: extract_branch
    if: github.event_name == 'pull_request'
    run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
  - uses: ponicode/ponicode-squar-action@master
    with:
      repoURL: ${{github.repository} # DO NOT MODIFY
      impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
      branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
      githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
      ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }}
      ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }}
      bootstrapUT: 'true'
      displayFullReport: 'true'
```
### 2. Raises Tests Quality alerts on files impacted by the PR, without bootstraping any remediation Unit-Tests. Also do not display Ponicode SQUAR report for the whole project.
```yaml
name: "ponicode-ci"
on:
  pull_request:
    types: [ edited, synchronize ]  # rebuild any PRs and main branch changes

jobs:
  ponicode:
    runs-on: ubuntu-latest
    env:
      SQUAR_API_URL: "https://ponicode-glados-prod.azurewebsites.net"
      FETCH_REPORT_RETRY_MILLISEC: 5000
    steps:
    - uses: actions/checkout@v1
    - run: |
        npm install -g ponicode
  - id: get_changed_files
    uses: jitterbit/get-changed-files@v1
    continue-on-error: true
    with:
      format: 'json'
  - id: extract_branch
    if: github.event_name == 'pull_request'
    run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
  - uses: ponicode/ponicode-squar-action@master
    with:
      repoURL: ${{github.repository} # DO NOT MODIFY
      impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
      branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
      githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
      ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }}
      bootstrapUT: 'false'
      displayFullReport: 'true'
```
# Examples of SQUAR reporting into Pull-Requests
### List of Testing Quality alerts on files impacted by a PR
![Ponicode SQUAR for Delta](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_on_delta.png)
### Ponicode SQUAR report on the whole project
![Ponicode SQUAR Full](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_full_report.png)

# Terms of use
By using this action, you will have to register on [Ponicode UT generation app](https://app.ponicode.com) and [Ponicode SQUAR app](https://squar.ponicode.com). The terms & conditions of both apply when using this Github Action.

# Contact us
We would love to have your feedbacks! Tell us what you love and what you want us to improve about this action at ping@ponicode.com. <br />
We also have a slack community, where people can give feedbacks, ask for help if they encounter problems with our products and where we keep you informed about our latest releases.<br />
Join us here: https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/<br />
If you want to know more about Ponicode and the different services we propose, you can check our website https://ponicode.com 🦄<br />