import { getExtension, ISettings, TextMateScopeDefaults } from '../../../models';
import {
  getHideComments,
  getEnvironmentKeys,
  getEnvironmentComments,
  updateEnvironmentKeys,
  updateEnvironmentComments,
  updateHideComments,
} from '../../../configuration';

export async function setupTestSuite(
  // extension: vscode.Extension<any> | undefined,
  originalValues: ISettings,
) {
  const extension = getExtension();

  // Save the original values
  originalValues.hideComments = getHideComments();
  originalValues.environmentKeys = getEnvironmentKeys();
  originalValues.environmentComments = getEnvironmentComments();

  // Set the test values
  await updateEnvironmentKeys(TextMateScopeDefaults.envKeys);
  await updateEnvironmentComments(TextMateScopeDefaults.envComments);
  await updateHideComments(false);
  return extension;
}

export async function teardownTestSuite(originalValues: ISettings) {
  // put back the original settings
  await updateEnvironmentKeys(originalValues.environmentKeys);
  await updateEnvironmentComments(originalValues.environmentComments);
  await updateHideComments(originalValues.hideComments);
}
