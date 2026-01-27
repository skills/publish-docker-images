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

   You can access the application through the `Ports` tab - on port `8080` and see the new high score feature!

   <img width="600" alt="Image showing the ports tab" src="https://github.com/user-attachments/assets/80944d79-898a-43f9-94a0-6a9cc153f38d" />

### ⌨️ Activity: Merge the pull request and create a release

Alright! Now let's merge the pull request and create a stable release with a proper version tag.

1. Go back to the Pull Request and merge it into `main`.
   > 🪧 **Note:** This will also trigger a new **Docker Publish** workflow run
1. Go to the **Code** tab of your repository and click on **Releases** (on the right sidebar).

   <img width="300" alt="Image showing the releases section of the repository" src="https://github.com/user-attachments/assets/a132ef5f-43cb-490c-b1fc-119f40eedb7c" />

1. Create a new release:
   - Choose a tag: `v1.0.0` (Create new tag)
   - Target: `main`
   - Release Title: `v1.0.0`
   - Release notes: `First official release with high score tracking!`

   <details>
   <summary>📸 Show screenshot</summary><br/>


   <img width="600" alt="screenshot of create release page" src="https://github.com/user-attachments/assets/c7e275b7-6881-41e0-a0d6-e59194f0c335" />
   
   </details>

1. At the bottom, click the **Publish release** button.
1. Go to the **[Actions](https://github.com/{{full_repo_name}}/actions)** tab one last time. You should see a workflow run triggered by the new tag.
   - This run will build the image with the `v1.0.0` tag.
1. Once the workflow finishes successfully verify the image `v1.0.0` image is present in the **Packages** section of your repository.
1. Once the release is published Mona will get back to you with a quick exercise review!

### ⌨️ Activity: (optional) Manage your package settings

You're done! As an optional step, you can explore the package settings for your Docker image to adjust visibility, access control or delete the package if desired.

<details>
<summary>✨ Bonus steps: manage package settings</summary>

1. Go to your **Stackoverflown** packages page and click **Package settings** on the right side.
   
   <img width="600"  alt="Image showing package settings button" src="https://github.com/user-attachments/assets/0c3c531b-5337-4d02-a364-b0ff28abb582" />


1. (optional) Under **Manage Actions access**, you can choose additional repositories that can access this package beyond the current repository.

   <img width="600" alt="Image showing manage actions access" src="https://github.com/user-attachments/assets/ed15d318-2b44-4120-9c83-a5d01afdadd2" />

   > 💡 **Tip:** This is particularly useful in an organization setting where multiple repositories may need access to the same package.

1. (optional) Under **Danger Zone** you change the visibility or delete the package (all of its versions).

   <img width="600" alt="Image showing danger zone section" src="https://github.com/user-attachments/assets/7928c7c0-def3-4d51-9a1d-42273ff68a36" />

   > ❕ **Important:** Since packages are linked to your **account** (not the repository), deleting this repository **will not** delete the package. If you ever want to delete the package you must delete do it from this page.

</details>
