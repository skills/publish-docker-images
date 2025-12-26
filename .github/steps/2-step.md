## Step 2: Enhanced Docker Actions



### 📖 Theory: Specialized Docker Actions

<!-- While basic Docker commands work, specialized GitHub Actions provide significant improvements for container workflows. The `docker/setup-buildx-action` enables BuildKit features like advanced caching, multi-platform builds, and improved performance.

The `docker/build-push-action` replaces manual `docker build` and `docker push` commands with a more configurable and efficient solution. It integrates seamlessly with Buildx and provides better error handling, caching strategies, and build optimization.

- **Buildx**: Docker's build engine with extended features beyond standard Docker build
- **Build context**: Defines which files and directories are sent to the Docker daemon
- **Push configuration**: Control when and how images are pushed to registries
- **Performance**: Buildx provides better caching and parallel build capabilities -->

#### References

- [Docker Buildx documentation](https://docs.docker.com/buildx/)
- [docker/build-push-action usage](https://github.com/docker/build-push-action#usage)

### ⌨️ Activity: See and run your docker image

1. Go to packages, copy bash command
1. In your codespace run ...

### ⌨️ Activity: Implement Docker Build Actions

1. Edit `.github/workflows/docker-publish.yml`.
1. Remove your existing `Build and push Docker image` step with `docker` commands. We will replace that with open source actions.
1. Add these following two steps

   ```yaml
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    - name: Build and push Docker image
      uses: docker/build-push-action@v6
      with:
        context: .
        push: true
        provenance: true
        tags: |
          ghcr.io/{{ full_repo_name | lower }}:latest
          ghcr.io/{{ full_repo_name | lower }}:{% raw %}${{ github.sha }}{% endraw %}
   ```

   Ensure the yaml indentation is setup correctly!

1. Commit and push your changes to the `main` branch.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Ensure you removed the previous `run` step with `docker build` and `docker push`.
- Check that `push: true` is set in the `docker/build-push-action` configuration.
- Verify that `docker/setup-buildx-action` is placed before `docker/build-push-action`.

</details>
