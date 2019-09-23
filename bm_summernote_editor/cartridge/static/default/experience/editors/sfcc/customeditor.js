(() => {
  /** The main Editor element to be tinkered with */
  var rootEditorElement;

  /**
   * initializes the base markup before page is ready. This is not part of the API, and called explicitely at the end of this module.
   */
  function init() {
    rootEditorElement = document.createElement('div');
    rootEditorElement.innerHTML = `
      <div class='slds-select_container'>
        <div id="summernote" class="summernote"></div>
      </div>
      `;
      
      document.body.appendChild(rootEditorElement);
      $(document).ready(function() {
        $('#summernote').summernote({
          height: 200,                 // set editor height
          minHeight: null,             // set minimum height of editor
          maxHeight: null,             // set maximum height of editor
          focus: true    
        });
      });
  };

  /** the page designer signals readiness to show this editor and provides an optionally pre selected value */
  listen('sfcc:ready', async ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
    const selectedValue = typeof value === 'object' && value !== null && typeof value.value === 'string' ? value.value : null;
    console.log(selectedValue);
    if (selectedValue !== null) {

      var textComponent = document.createElement('p');
      textComponent.innerHTML = selectedValue.trim(); 
      rootEditorElement.querySelector('.note-editable').appendChild(textComponent);
    }
    // Change listener will inform page designer about currently selected value
    rootEditorElement.querySelector('.note-editable').addEventListener('mouseout', event => {
      emit({
        type: 'sfcc:interacted'
      });
      const selectedValue = $(event.target).html();
      if (selectedValue !== '<p><br></p>' && selectedValue !== null) {
        emit({
          type: 'sfcc:value',
          payload: selectedValue ? { value: selectedValue } : null
        });
      }
    });
  });

  // When a value was selected
  listen('sfcc:value', value => {});
  // When the editor must require the user to select something
  listen('sfcc:required', value => {});
  
  init();

})();
