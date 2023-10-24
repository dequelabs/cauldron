const isAllowedStyleSheet = (styleSheet: StyleSheet) => {
  try {
    return (
      !styleSheet.href ||
      new URL(styleSheet.href).origin === window.location.origin
    );
  } catch (ex) {
    console.error(ex);
  }

  return false;
};

export function getCssVariablesStartingWith(prefix: string) {
  const cssVariables: { [key: string]: string } = {};

  // Iterate through all style sheets in the document
  for (const styleSheet of Array.from(document.styleSheets).filter(
    isAllowedStyleSheet
  )) {
    try {
      if (styleSheet.cssRules) {
        // Iterate through the rules in the style sheet
        for (const rule of Array.from(styleSheet.cssRules)) {
          if (rule instanceof CSSStyleRule) {
            const style = rule.style;

            // Iterate through the style properties of each rule
            for (let i = 0; i < style.length; i++) {
              const propertyName = style[i];
              const propertyValue = style.getPropertyValue(propertyName);

              // Check if the property is a CSS variable and starts with the prefix
              if (
                propertyName.startsWith('--') &&
                propertyName.startsWith(prefix)
              ) {
                cssVariables[propertyName] = propertyValue;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error accessing stylesheet:', error);
    }
  }

  return cssVariables;
}
