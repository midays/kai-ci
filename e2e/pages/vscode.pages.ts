// launch_vscode.page.ts
import { _electron as electron, ElectronApplication, Page } from 'playwright';
import { execSync } from 'child_process';
import { expect } from '@playwright/test';
import * as fs from 'fs';

class LaunchVSCodePage {
  private vscodeApp: ElectronApplication | null = null;
  private window: Page | null = null;

  public async launchVSCode(executablePath): Promise<void> {
    // Get the VSIX file path from environment variable
    const vsixFilePath = process.env.VSIX_FILE_PATH;

    if (vsixFilePath) {
      // Pass the environment variable to the method
      this.installExtensionFromVSIX(vsixFilePath);
    } else {
      console.error('Error: VSIX_FILE_PATH is not set in the environment.');
    }
    // this.installExtensionFromVSIX(process.env.VSIX_FILE_PATH)
    this.vscodeApp = await electron.launch({
      executablePath: executablePath, // Path to VSCode executable
    });
    this.window = await this.vscodeApp.firstWindow();

    const title = await this.window.title();
    console.log(`VSCode window title: ${title}`);

    expect(title).toContain('Visual Studio Code');
  }

  // public async installExtensionFromVSIX(vsixFilePath): Promise<void> {
  //   if (!fs.existsSync(vsixFilePath)) {
  //     throw new Error(`VSIX file not found at path: ${vsixFilePath}`);
  //   }

  //   if (!this.window) {
  //     throw new Error("VSCode window is not initialized.");
  //   }

  //   const extensionsTab = await this.window.getByRole("tab", {
  //     name: "Extensions (Ctrl+Shift+X)",
  //   });
  //   await extensionsTab.locator("a").waitFor({ state: "visible" });
  //   await extensionsTab.locator("a").click({ force: true });

  //   const extensionsActionsButton =
  //     await this.window.getByLabel("Extensions actions");
  //   await extensionsActionsButton.click();

  //   // Find the "Views and More Actions..." inside the Extensions actions and click it
  //   const moreActionsButton = await extensionsActionsButton.getByLabel(
  //     "Views and More Actions...",
  //   );
  //   await moreActionsButton.click();

  //   await this.window.click(
  //     '.context-view .menu-item span:has-text("Install from VSIX...")',
  //   );
  //   // Set the file input for the VSIX file
  //   const inputSelector = 'input[type="file"]';
  //   await this.window.setInputFiles(inputSelector, vsixFilePath);

  //   // Wait for the uninstall button to appear indicating the extension is installed
  //   await this.window.waitForSelector(".extension-list-item .uninstall", {
  //     timeout: 60000,
  //   });
  // }

  public installExtensionFromVSIX(vsixFilePath: string): void {
    // Install VSCode extension using terminal command
    try {
      console.log(`Installing extension from ${vsixFilePath}...`);
      execSync(`code --install-extension ${vsixFilePath}`, {
        stdio: 'inherit',
      });
      console.log('Extension installed successfully');
    } catch (error) {
      console.error('Error installing the VSIX extension:', error);
    }
  }

  // Method to close VSCode
  public async closeVSCode(): Promise<void> {
    if (this.vscodeApp) {
      await this.vscodeApp.close();
    }
  }
}

export { LaunchVSCodePage };
