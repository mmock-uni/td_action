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

- Pushing the new code/release with the command `ncc build src/index && git add . && git commit -m "new build" && git tag -a -m "new release" v3.2.20.33 && git push --follow-tags`

 `ncc build src/index` creates an optimised build (install ncc with `npm i -g @vercel/ncc`)
 
- Check what the interaction of the action was like