## 🦄 Ponicode has been acquired by CircleCI :rocket: [Read the announcement here](http://www.ponicode.com/blog/circleci-completes-acquisition-of-ponicode)

<p align="center">
<img src="https://ponicodefilesstorage.blob.core.windows.net/githubaction/Couv_readme_SQUAR_GA.png"></p>

# 🦄 Release quality tests. Every Time!🦄
**Quality Gate** tells you at every analysis whether your is tested enough to be released

**Ponicode SQUAR GitHub Action** is an action that enables you to grade the test quality of your project and provide you with a precise and activatable improvements roadmap at every Pull request!


**Combined with [Ponicode Unit Test Action](https://github.com/marketplace/actions/ponicode-unit-test)**, you can immediately implement the SQUAR roadmap and get instantaneous coverage catch-up 

# 💥 Benefits
Tackle your code quality issues in the right order to:

- __GAIN VISIBILITY__ - Get instant feedback of the quality of your tests everytime you change your code
- __PRIORITIZED BACKLOG__ - Get a detailed and prioritized list of action you need to take to increase your test quality
- __RAISE YOUR CODE QUALITY FAST__ - Accelerate the remediation of your code quality weaknesses on your high risk functions (When Ponicode SQUAR action is combined with Ponicode Unit-Testing Action)


# 🔎 How does it work
- __Step 1__: Ponicode SQUAR GitHub Action generates a report for every PR where you can review the number of poorly tested critical functions and learn how to fix it.
- __Step 2__: Ponicode SQUAR GitHub Action enables you to accelerate the remediation of these weaknesses by generating missing unit tests, test cases and edge cases on your PR (When Ponicode SQUAR action is combined with [Ponicode Unit Test Action](https://github.com/marketplace/actions/ponicode-unit-test))

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
You can also just create a folder named ``.github``, in it create another folder named ``workflows``. You can now create a YAML file named **``ponicode.yml``** and copy one of the following examples in it! <br />

### Existing workflow
Here is what you must add in your ```.github/workflows/ponicode.yml``` file to activate and use Ponicode SQUAR Action  to trigger the action, including the immediate remediation implementation with [Ponicode Unit Test Action](https://github.com/marketplace/actions/ponicode-unit-test).

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
    - uses: ponicode/squar_action@master
      id: ponicode_squar
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }} # DO NOT MODIFY
        displayFullReport: 'true'   
```
### Once configured, this workflow:

1. grades the code contained into the created / updated PR, and lists the alerts (= functions introduced / updated in the PR that are not / not-well tested)
2. optionaly (if displayFullReport parameter is set to true): displays the SQUAR report for the whole project
3. bootstraps the (missing) unit-tests for the functions included in the PR into a dedicated new PR.
![SQUAR + Unit-test generation workflow](https://ponicodefilesstorage.blob.core.windows.net/githubaction/ezgif.com-gif-maker.gif)


### Ponicode SQUAR Action parameters
| Name | Description | Required | Default |
|------|-------------|----------|---------|
| ``displayFullReport`` | Boolean: set if Ponicode SQUAR report on the whole project shall be displayed as for information in the PR comment (True), or not (False) | Yes |``true`` |
| ``ponicodeSquarToken`` | This parameter has to be configured as **``PONICODE_SQUAR_TOKEN``** in Repository Github Secrets. The token can be retrieved on [Ponicode SQUAR app](https://app.ponicode.com/home). | Yes | No default. This parameter must be set-up in your GITHUB SECRETS (see below on how to do that) |

**NB: all the other parameters must be let un-changed, since they are automatically filled-in from previous steps in the workflow**
- ``repoURL``
- ``impactedFiles``
- ``branch``
- ``githubToken``

**NB2: you can find the procedure on how to setup Github Secrets here**: [Github Secrets setup](https://docs.github.com/en/actions/security-guides/encrypted-secrets). Here is an overview:

To add the Ponicode token to your github secrets follow these steps:

- Open your project on Github
- Click on Settings
- Click on Secrets
- Click on New Secret
- Name: PONICODE_SQUAR_TOKEN, Value: (Paste the token you got previously)

**Ponicode SQUAR Action outputs**
| Name | Description | Usage |
|------|-------------|-------|
| ``impactedFiles`` | Array of files on which Ponicode SQUAR found some testing alerts | the Action output can be used in further Action thant to ```${{ steps.ponicode_squar.outputs.impacted_files }}```. In particular, this can be the input for [Ponicode Unit Test Action](https://github.com/marketplace/actions/ponicode-unit-test) |


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
    - uses: ponicode/squar_action@master
      id: ponicode_squar
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }} # DO NOT MODIFY
        displayFullReport: 'true'

    # Run Ponicode Unit-Testing action
    - uses: ponicode/unit-testing-action@master
      id: ponicode_unit_testing
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeUtToken: ${{ secrets.PONICODE_TOKEN }} # DO NOT MODIFY
        impactedFiles: ${{ steps.ponicode_squar.outputs.impacted_files }} # DO NOT MODIFY IF YOU WANT TO GENERATE TESTS ON SQUAR OUTCOME ONLY
        commentUTs: "true"
```
#### 2. Raises Tests Quality alerts on files impacted by the PR, without bootstrapping any remediation Unit-Tests. Also do not display Ponicode SQUAR report for the whole project.
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
    - uses: ponicode/squar_action@master
      id: ponicode_squar
      with:
        repoURL: ${{github.repository}} # DO NOT MODIFY
        impactedFiles: ${{ steps.get_changed_files.outputs.added_modified }} # DO NOT MODIFY
        branch: ${{ steps.extract_branch.outputs.BRANCH_NAME }} # DO NOT MODIFY
        githubToken: ${{ secrets.GITHUB_TOKEN }} # DO NOT MODIFY
        ponicodeSquarToken: ${{ secrets.PONICODE_SQUAR_TOKEN }} # DO NOT MODIFY
        displayFullReport: 'true'
```
# 🧐 Examples of SQUAR reporting in Pull-Requests
### List of Testing Quality alerts on files impacted by a PR
![Ponicode SQUAR for Delta](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_on_delta.png)
### Project-wide Ponicode SQUAR report
![Ponicode SQUAR Full](https://ponicodefilesstorage.blob.core.windows.net/githubaction/SQUAR_ACTION_full_report.png)

# 🤔 What is a critical piece of code ? 
Ponicode research and development work enables us to fine tune a proprietary formula to spot the most important functions of your codebase. This formula is based on how much of an impact the function has on the overall behavior of your application. This translates into getting a better visibility over how likely a weakness in a function could generate an impactful bug for your software. Still unsure about what makes a high risk function? Here’s 2 weighted elements we put into our equation.
- __Complexity to Repair__: Measure of how difficult a function is to intuitively understand and modify. This measure is between 0 and 1
- __Impact of a function on the code-base__: Measure of how much the function is used in the project. This measure is between 0 and 1


# ⽭ Supported languages and frameworks
| Language | Test Framework |
|------|-------------|
| TypeScript | [Jest](https://jestjs.io/) |
| Javascript | [Jest](https://jestjs.io/) |


# 📄 Terms of use
By using this action, you will have to register on the [Ponicode SQUAR app](https://squar.ponicode.com) and if you want to use [Ponicode Unit Test Action](https://github.com/marketplace/actions/ponicode-unit-test), register on [Ponicode platform](https://app.ponicode.com). The terms & conditions of both apply when using this Github Action.

**Highlights to our Terms & Conditions**
- Ponicode does not store your code
- Ponicode use anonymous usage data to improve your experience 

# 🪳Bug and feature Request
Have a bug or a feature request? Please open a new [issue](https://github.com/ponicode/squar_action/issues) or reach out to us on the Ponicode Slack community https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/ using the channel #help or #feedback starting your message with “Ponicode SQUAR GitHub Action”

We would love to have your feedback! Tell us what you love and what you want us to improve about this action!

# 👯‍♀️ Community
Our slack community is a place where people not only give feedback and get support but also an opportunity to share information and best practices about code quality. It’s also where you will get premium access to our new products and first hand information about our latest releases. Join us here: https://ponicode-community.slack.com/join/shared_invite/zt-fiq4fhkg-DE~a_FkJ7xtiZxW7efyA4Q#/


# Learn More
Want to find out more about our project? All our solutions are available on [ponicode.com](https://ponicode.com)

You can generate a [Ponicode SQUAR](https://app.ponicode.com/home) report for any of your GitHub repositories straight from our platform. Get started on [Ponicode SQUAR Self Assessment](https://www.ponicode.com/squar-self-assessment)

We also offer a unique [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ponicode.ponicode) to accelerate your unit testing efforts. 

Our AI-powered unit testing bulk generation is also available in the command line interface. Go discover our [npm package](https://www.npmjs.com/package/ponicode) today! 

We also have a [docstring generating GitHub Action](https://github.com/marketplace/actions/ponicode-dogstring-automatic-ai-based-docstring-generation) for Python 
