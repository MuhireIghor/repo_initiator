# repoinitiator

With CLI, create a new github repo with basic setup.

## Installation

```shell
npm i -g repoinitiator
```

> **Note**: For linux distros' users rember to add ```sudo```.

## Configuration

To configure ```repoinitiator``` locally, run this command:

```ts
repoinitiator config
```

Add your github username and Github PAT (Github Personal Access Token).

> [!Important]
> PAT must have access to creating or modifying repositories.

Follow steps in [this article](https://docs.github.com/en/enterprise-server@3.9/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) in order to get you PAT.

## Usage

```shell
repoinitiator new <repo_name>
```

<repo_name> is the name you want to give your repository.

>**Note**: You'll be prompted to enter directory where the project will reside locally.
>If you want it to be current directory you're in please add period(.) only.

## Contributing

Refer to [contributing.md](https://github.com/MuhireIghor/repo_initiator/blob/main/CONTRIBUTING.md) if you want to contribute.

## License

Our project is licensed under MIT license which can be found [here](https://github.com/MuhireIghor/repo_initiator/blob/main/LICENSE).

## Maintainers

This project is currently maintained by [@MuhireIghor](https://github.com/MuhireIghor) and [@pacifiquem](https://github.com/pacifiquem).
