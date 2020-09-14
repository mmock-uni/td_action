# Technical Dept Action

### setup

In the following it is an example how a minimal yml file could look like, in oder to setup this action 

```
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to control the code
    steps:
      - uses: actions/checkout@v2
      - uses: mmock-uni/td_action@v3.2.20.33
```

### Workflow

- Change code, this could be for bug fix, new functionality, restructuring or something else!

- Set a new release Tag in the yml file (.github/workflow/main.yml)

![image](https://user-images.githubusercontent.com/23076328/93134549-3245e900-f6d9-11ea-8bac-e725148cd7de.png)

- Pushing the new code/release with the command `ncc build src/index && git add . && git commit -m "new build" && git tag -a -m "new release" v3.2.20.33 && git push --follow-tags`

 `ncc build src/index` creates an optimised build (install ncc with `npm i -g @vercel/ncc`)
 ![image](https://user-images.githubusercontent.com/23076328/93134616-4a1d6d00-f6d9-11ea-8e3e-0c023fd25da6.png)
 
- Check what the interaction of the action was like and deciding what next could be done

![image](https://user-images.githubusercontent.com/23076328/93134976-dc257580-f6d9-11ea-9ce5-caa0341cb55a.png)
