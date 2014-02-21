/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
  
    config.toolbar_Full = [[  'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo','Find', 'Replace', '-', 'SelectAll', '-','Bold', 'Italic', 'Subscript', 'Superscript', '-', 'RemoveFormat','NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'Link', 'Unlink', 'Anchor','Image', 'Flash', 'Table' , 'SpecialChar',  'Format', 'TextColor', 'ShowBlocks', '-','Source']];
    config.toolbar_Basic = [['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink']];
    config.toolbar = 'Full';
    config.filebrowserImageBrowseUrl = '/CKEditor/Browser';
};
