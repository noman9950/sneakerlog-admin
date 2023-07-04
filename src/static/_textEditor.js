export const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
    INLINE_STYLE_BUTTONS: [
      {
        label: 'Bold',
        style: 'BOLD',
        className: 'custom-css-class',
      },
      {
        label: 'Italic',
        style: 'ITALIC',
      },
      {
        label: 'Underline',
        style: 'UNDERLINE',
      },
    ],
    BLOCK_TYPE_DROPDOWN: [
      {
        label: 'Normal',
        style: 'unstyled',
      },
      {
        label: 'Large Heading',
        style: 'header-three',
      },
      {
        label: 'Medium Heading',
        style: 'header-four',
      },
      {
        label: 'Small Heading',
        style: 'header-five',
      },
    ],
    BLOCK_TYPE_BUTTONS: [
      {
        label: 'UL',
        style: 'unordered-list-item',
      },
      {
        label: 'OL',
        style: 'ordered-list-item',
      },
    ],
  };