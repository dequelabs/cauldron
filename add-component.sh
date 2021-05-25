# styles #
##########
touch packages/styles/$1.css
echo "@import './$1.css';" >> packages/styles/index.css

# react #
#########
component=$1
# first char to upper case
componentName="$(tr '[:lower:]' '[:upper:]' <<< ${component:0:1})${component:1}"
mkdir packages/react/src/components/$componentName
touch packages/react/src/components/$componentName/index.tsx
