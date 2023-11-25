const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory')

describe('Memory DB test', ()=>{
  test('writeFragment() returns nothing', async () => {
    const ownerId = 'user123';
    const fragmentId = 'fragment456';
    const fragment = { ownerId, id: fragmentId, data: 'Sample metadata' };

    const result = await writeFragment(fragment);

    expect(result).toBe(undefined);
  });

  test('writeFragment and readFragment should work correctly', async () => {
    const ownerId = 'user123';
    const fragmentId = 'fragment456';
    const fragment = { ownerId, id: fragmentId, data: 'Sample metadata' };

    // Write the fragment's metadata
    await writeFragment(fragment);

    // Read the fragment's metadata
    const result = await readFragment(ownerId, fragmentId);

    expect(result).toEqual(fragment);
  });

  test('writeFragmentData and readFragmentData should work correctly', async () => {
    const ownerId = 'user123';
    const fragmentId = 'fragment456';
    const buffer = Buffer.from('Sample data');

    // Write the fragment's data
    await writeFragmentData(ownerId, fragmentId, buffer);

    // Read the fragment's data
    const result = await readFragmentData(ownerId, fragmentId);

    expect(result).toEqual(buffer);
  });
  test('deleteFragment should work correctly', async () => {
    const ownerId = 'user123';
    const fragmentId = 'fragment456';
    const buffer = Buffer.from('Sample data');

    // Write the fragment's metadata and data
    await writeFragment({ ownerId, id: fragmentId, data: 'Sample metadata' });
    await writeFragmentData(ownerId, fragmentId, buffer);

    // Delete the fragment
    await deleteFragment(ownerId, fragmentId);

    // Verify that the fragment is deleted
    const metadataResult = await readFragment(ownerId, fragmentId);
    const dataResult = await readFragmentData(ownerId, fragmentId);

    expect(metadataResult).toBeUndefined();
    expect(dataResult).toBeUndefined();
  });


})
