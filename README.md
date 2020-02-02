# Action: Docker Image

Build and publish an Docker Image to Registry.

## Inputs

### image_name

**Required** Name of Image

So that an image can be assigned by name, a unique name must be assigned.

### image_tag

**Default**: `latest`

Each image should have a tag for unique identification.

### build_args

**Optional**:

Docker build arguments in format `KEY=VALUE,KEY=VALUE`.

### registry

**Default** `registry.hub.docker.com` Registry host.

URL of a Docker compatible registry for pushing a Docker image.

### registry_username

**Required** Registry Username

### registry_password

**Required** Registry Password

Registry Password. This should be stored in a Secret on Github.

See https://help.github.com/en/github/automating-your-workflow-with-github-actions/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables.

### dockerfile

**Default**: `dockerfile`

Storage location of the Docker file.

## Example Usage

```yaml
- name: Build and Publish Image
  uses: tinact/docker.image@master
  with:
    api_key: '3fe6ff42edm793ddei5'
```

## License

This project is under the MIT License. See the [LICENSE](licence) file for the full license text.

## Copyright

(c) 2020, Tinact
