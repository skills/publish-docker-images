## Step 4: Release the Game

You have successfully set up a robust workflow that automatically tags your Docker images based on the Git context!

Now, let's put it to the test by simulating a real-world development cycle: adding a feature, merging it, and releasing a new version.

### ⌨️ Activity: Add a feature

Let's start off by adding a simple code change to our source code.

1. Start by switching to a new branch called `feature/add-high-score`:

    ```bash
    git branch feature/add-high-score
    git checkout feature/add-high-score
    ```

1. Open the `src/index.html` file.
1. At `line 20`, replace the `info-section` area about scoring with the below example.

   ```txt
   <div class="info-section">
      <h3>Current Score</h3>
      <div class="score" id="score">0</div>
      <h3>High Score</h3>
      <div class="high-score" id="high-score">0</div>
   </div>
   ```

   This will demonstrate 3 kinds of changes:

   - Modify the `Score` label to `Current Score`
   - Add the `High Score` information.
   - Remove the `status` information.

1. Commit and push your changes to the `feature/add-high-score` branch.

   ```bash
   git add src/index.html
   git commit -m "Add high score display"
   git push -u origin feature/add-high-score
   ```

### ⌨️ Activity: Create a pull request

Now that you have your feature branch ready, let's create a Pull Request to see if your workflow builds the image with the appropriate `pr-X` tag.

1. In a new browser tab, navigate to the [Pull Requests](https://github.com/{{full_repo_name}}/pulls) tab of your repository.
1. Create a Pull Request targeting `main` branch from the branch you just created. 
   > ⏳ **Wait:** Don't merge it yet!
1. Go to the **[Actions](https://github.com/{{full_repo_name}}/actions)** tab and watch the `Docker Publish` workflow run triggered by the Pull Request.
   - This run will build the image with the `pr-X` tag (e.g., `pr-2`).
1. Once the workflow finishes successfully verify the image is present in the **Packages** section of your repository.
1. (optional) You can pull and run the image in your codespace to see the changes in action before merging!

    Replace `<PR_NUMBER>` with your actual Pull Request number:

    ```bash
    docker run -d -p 8080:80 ghcr.io/{{ full_repo_name | lower }}/stackoverflown:pr-<PR_NUMBER>
    ```

### ⌨️ Activity: Merge the pull request and create a release

Alright! Now let's merge the pull request and create a stable release with a proper version tag.

1. Go back to the Pull Request and merge it into `main`.
   > 🪧 **Note:** This will also trigger a new **Docker Publish** workflow run
1. Go to the **Code** tab of your repository and click on **Releases** (on the right sidebar).

    <img width="300" alt="Image showing the releases section of the repository" src="https://github.com/user-attachments/assets/0b158ddf-b7f9-42c1-8a9e-3fef5a6a2570" />

1. Create a new release:
   - Choose a tag: `v1.0.0` (Create new tag)
   - Target: `main`
   - Release Title: `v1.0.0`
   - Release notes: `First official release with high score tracking!`
1. At the bottom, click the **Publish release** button.
1. Go to the **[Actions](https://github.com/{{full_repo_name}}/actions)** tab one last time. You should see a workflow run triggered by the new tag.
   - This run will build the image with the `v1.0.0` tag.
1. Once the release is published Mona will get back to you with a quick exercise review!
