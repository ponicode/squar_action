<p align="center">
<img src="https://ponicodefilesstorage.blob.core.windows.net/githubaction/Couv readme SQUAR GA.png">

# 🦄 Grade your testing suite and automatically improve your code coverage!🦄
**Ponicode SQUAR GitHub Action** is an action that enables you to  grade your testing suite and improve your code coverage accordingly at every Pull request!

**Ponicode SQUAR GitHub Action** is the newest tool on the Ponicode platform to accelerate developers on their code quality journey

# 💥 Benefits
Tackle your code quality issues in the right order

- __GAIN VISIBILITY__ - Stop monitoring your code and start getting actionable code quality information
- __FIND YOUR PRIORITIES__ - Prioritise your code quality efforts
- __RAISE YOUR CODE QUALITY FAST__ - Accelerate the remediation of your code quality weaknesses on your high risk functions

# 🔎 How does it work
- __Step 1__: Ponicode SQUAR GitHub Action generates a report for every PR where you can review the number of poorly tested critical functions and learn how to fix it.
- __Step 2__: Ponicode SQUAR GitHub Action enables you to accelerate the remediation of these weaknesses by generating missing unit tests, test cases and edge cases on your PR.

# 😳 Why should I use this GitHub Action
- Keep your risk sensitive code at a high test coverage
- Avoids weaknesses from the most important function 
- Reduce the chances of facing bugs in production

# ⚙️ How to setup this action

### If it does not exist, create a yaml workflow file in your project

Add the following lines to any of your Github Action workflow.

Go to the root of your project, and create the path to your workflow file. For example
```
mkdir -p .github/workflows
```
You can also just create a folder named ``.github``, in it create another folder named ``workflows``. You can now create a YAML file named **``ponicode.yml``** and copy one of the following example in it! <br />

### Existing workflow
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
    
    # Identify which files are impacted by the Push / PR
    - id: get_changed_files
      uses: jitterbit/get-changed-files@v1
      continue-on-error: true
      with:
        format: 'json'

    # Extract branch name
    - id: extract_branch
      if: github.event_name == 'pull_request'
      run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"

    # Run Ponicode SQUAR action
    - uses: ponicode/squar_action@public/master
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }}
        ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }}
        bootstrapUT: 'true'
        displayFullReport: 'true'
```
### Once configured, this workflow:

1. grades the code contained into the created / updated PR, and lists the alerts (= functions introduced / updated in the PR that are not / not-well tested)
2. optionaly (if displayFullReport parameter is set to true): displays the SQUAR report for the whole project
3. optionaly (if bootstrapUT parameter is set to true), bootstraps the (missing) unit-tests for the functions included in the PR into a dedicated new PR.
![SQUAR + Unit-test generation workflow](https://ponicodefilesstorage.blob.core.windows.net/githubaction/ezgif.com-gif-maker.gif)


### Ponicode SQUAR Action parameters
| Name | Description | Required | Default |
|------|-------------|----------|---------|
| ``bootstrapUT`` | Boolean: Set if missing Unit-Tests shall be automatically bootstraped by Ponicode (True) or not (False) | Yes | ``true`` |
| ``displayFullReport`` | Boolean: set if Ponicode SQUAR report on the whole project shall be displayed as for information in the PR comment (True), or not (False) | Yes |``true`` |
| ``ponicodeSquarToken`` | This parameter has to be configured as **``PONICODE_SQUAR_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode SQUAR app](https://squar.ponicode.com). | Yes | No default. This parameter must be set-up in your GITHUB SECRETS (see below on how to do that) |
| ``ponicodeUtToken`` | This parameter has to be configured as **``PONICODE_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode UT Generation App](https:/:app.ponicode.com). | Yes if ``bootstrapUT`` is set to ``true``, No if not | No default. This parameter has to be set-up in your GITHUB SECRETS (see below on how to do that) |

**NB: all the other parameters must be let un-changed, since they are automatically filled-in from previous steps in the workflow**
- ``repoURL``
- ``impactedFiles``
- ``branch``
- ``githubToken``

**NB2: you can find the procedure on how to setup Github Secrets here**: [Github Secrets setup](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

# 👩‍💻 Use-Cases
Here are some examples of ```.github/workflows/ponicode.yml``` file to setup Ponicode SQUAR Action
#### 1. Raises Tests Quality alerts and bootstrap remediation Unit-Tests on each created / updated PR. Also includes Ponicode SQUAR report for the whole project.
```yaml
name: "ponicode-ci"
on:
  pull_request:
    types: [ opened, edited, synchronize ]  # rebuild any PRs and main branch changes

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
    
    # Identify which files are impacted by the Push / PR
    - id: get_changed_files
      uses: jitterbit/get-changed-files@v1
      continue-on-error: true
      with:
        format: 'json'

    # Extract branch name
    - id: extract_branch
      if: github.event_name == 'pull_request'
      run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
    
    # Run Ponicode SQUAR action
    - uses: ponicode/squar_action@public/master
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }}
        ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }}
        bootstrapUT: 'true'
        displayFullReport: 'true'
```
#### 2. Raises Tests Quality alerts on files impacted by the PR, without bootstraping any remediation Unit-Tests. Also do not display Ponicode SQUAR report for the whole project.
```yaml
name: "ponicode-ci"
on:
  pull_request:
    types: [ opened, edited, synchronize ]  # rebuild any PRs and main branch changes

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
    
    # Identify which files are impacted by the Push / PR
    - id: get_changed_files
      uses: jitterbit/get-changed-files@v1
      continue-on-error: true
      with:
        format: 'json'

    # Extract branch name
    - id: extract_branch
      if: github.event_name == 'pull_request'
      run: echo "::set-output name=BRANCH_NAME::$(echo ${GITHUB_HEAD_REF})"
    
    # Run Ponicode SQUAR action
    - uses: ponicode/squar_action@public/master
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }}
        bootstrapUT: 'false'
        displayFullReport: 'true'
```
# 🧐 Examples of SQUAR reporting in Pull-Requests
### List of Testing Quality alerts on files impacted by a PR
![Ponicode SQUAR for Delta](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_on_delta.png)
### Ponicode SQUAR report on the whole project
![Ponicode SQUAR Full](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_full_report.png)

# 🤔 What is a critical piece of code ? 
Ponicode research and development work enables us to fine tune a proprietary formula to spot the most important functions of your codebase. This formula is based on how much of an impact the function has on the overall behavior of your application. This translates into getting a better visibility over how likely a weakness in a function could generate an impactful bug for your software. Still unsure about what makes a high risk function? Here’s 2 weighted elements we put into our equation.
- __Complexity to Repair__: Measure of how difficult a function is to intuitively understand and modify. This measure is between 0 and 1
- __Impact of a function on the code-base__: Measure of how much the function is used in the project. This measure is between 0 and 1


# ⽭ Supported languages and frameworks
| Languague | Test Framework |
|------|-------------|
| TypeScript | [Jest](https://jestjs.io/) |
| Javascript | [Jest](https://jestjs.io/) |


# 📄 Terms of use
By using this action, you will have to register on the [Ponicode platform](https://app.ponicode.com) and the [Ponicode SQUAR app](https://squar.ponicode.com). The terms & conditions of both apply when using this Github Action.

**highlights to our Terms & Conditions**
- Ponicode does not store your code
- Ponicode use anonymous usage data to improve your experience 

# 🪳Bug and feature Request
Have a bug or a feature request? Please open a new [issue](https://github.com/ponicode/squar_action/issues) or reach out to us on the Ponicode Slack community https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/ using the channel #help or #feedback starting your message with “Ponicode SQUAR GitHub Action”

We would love to have your feedback! Tell us what you love and what you want us to improve about this action!

# 👯‍♀️ Community
Our slack community is a place where people not only give feedback and get support but also an opportunity to share information and best ractices about code quality. It’s also where you will get premium access to our new products and first hand information about our latest releases. Join us here: https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/


# Learn More
Want to find out more about our project? All our solutions are available on [ponicode.com](https://ponicode.com)

You can generate a [Ponicode SQUAR](https://squar.ponicode.com) report for any of your GitHub report straight from our platform. Get started on [Ponicode SQUAR Self Assessment](https://www.ponicode.com/squar-self-assessment)

We also offer a unique [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ponicode.ponicode) to accelerate your unit testing efforts. 

Our AI-powered unit testing bulk generation is also available in the command line interface. Go discover our [npm package](https://www.npmjs.com/package/ponicode) today! 

We also have a [docstring generating GitHub Action](https://github.com/marketplace/actions/ponicode-dogstring-automatic-ai-based-docstring-generation) for Python 
