## As a reminder, here is the signification of the Ponicode Criticity
- __Criticity of a function__: this is a weighted sum of the complexity of repair (CR) of a function with the impact of the function on the code-base
- __Complexity of Repair (CR)__: Measure of how difficult a function is to intuitively understand and modify. This measure is between 0 and 1
- __Impact of a function on the code-base__: A measure between 0 and 1 that measures how much the function is used in the project

| Criticity | Meaning |
| :---: | :---: |
| Hightly Critical | The functions is highly complex to repair and / or is widely used in the codebase |
| Critical | The function is complex to repair and / or is used in quite some places in the codebase |
| Not Critical | the function is not complex to repair and is not so used in the codebase | 