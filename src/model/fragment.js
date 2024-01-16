// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');
// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!type) {
      throw new Error('type is required');
    } else if (!ownerId) {
      throw new Error('owner id required');
    } else if (!ownerId | !type) {
      throw new Error('owner Id and type are required');
    } else if (typeof size !== 'number' || size < 0) {
      throw new Error('size must be a positive number');
    } else if (!Fragment.isSupportedType(type)) {
      throw new Error('invalid type');
    } else {
      this.id = id || randomUUID();
      this.ownerId = ownerId;
      this.created = created || new Date().toISOString();
      this.updated = updated || new Date().toISOString();
      this.type = type;
      this.size = size;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    logger.debug({ ownerId, expand }, 'Fragment.byUser()');
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const fragment = await readFragment(ownerId, id);

      if (!fragment) {
        throw new Error(`no fragment with provided id was found in database`);
      }

      if (fragment instanceof Fragment) {
        return Promise.resolve(fragment);
      } else {
        return Promise.resolve(new Fragment(fragment));
      }
    } catch (err) {
      throw new Error(`error retrieving fragment: ${err.message}`);
    }
  }
  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString(); // Update the 'updated' property with a new timestamp
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    try {
      const fragmentData = await readFragmentData(this.ownerId, this.id);

      if (!fragmentData) {
        throw new Error(`no fragment data was found in database`);
      }

      return Promise.resolve(fragmentData);
    } catch (err) {
      throw new Error(`error retrieving fragment data: ${err.message}`);
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('data doesnt contain Buffer');
    }
    this.size = Buffer.byteLength(data);
    await this.save();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.mimeType.match(/text\/+/)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];

      case 'text/markdown':
        return ['text/markdown', 'text/html', 'text/plain'];

      case 'text/html':
        return ['text/html', 'text/plain'];

      case 'application/json':
        return ['application/json', 'text/plain'];

      case 'image/png':
      case 'image/jpeg':
      case 'image/webp':
      case 'image/gif':
        return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

      default:
        return null;
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return (
      value === 'text/plain' ||
      value === 'text/plain; charset=utf-8' ||
      value === 'application/json' ||
      value === 'text/markdown' ||
      value === 'text/html'
    );
  }
}

module.exports.Fragment = Fragment;
