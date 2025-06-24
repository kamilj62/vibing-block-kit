import { readFileSync, writeFileSync } from 'fs';
import glob from 'glob';

function updateStorybookImports() {
  try {
    // Find all story files
    const files = glob.sync('**/*.stories.@(ts|tsx)', {
      ignore: ['node_modules/**', 'dist/**', '**/node_modules/**', '**/dist/**'],
      absolute: true,
    });

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      
      // Only process files that have the old import
      if (content.includes("@storybook/react-vite")) {
        const newContent = content.replace(
          /from ['"]@storybook\/react-vite['"]/g,
          "from '@storybook/react'"
        );
        
        writeFileSync(file, newContent, 'utf-8');
        // File updated
      }
    }

    // Script completed successfully
  } catch (error) {
    console.error('Error updating storybook imports:', error);
    process.exit(1);
  }
}

updateStorybookImports();
