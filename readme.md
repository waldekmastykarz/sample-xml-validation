# XML Validation sample

Sample project showing how to validate XML files using an XSD schema. The different XML files in the project represent the different test scenarios. Run using:

```
$ gulp validate-xml
```

## Remarks

This sample is based on the Office Add-in manifest and its XSD as published on https://msdn.microsoft.com/en-us/library/fp123711. The XSD had to be modified on line 249 from:

```xml
<xs:pattern value="([0-9]{1,5})(\.[0-9]{1,5}){0,3}?"/>
```

to

```xml
<xs:pattern value="([0-9]{1,5})(\.[0-9]{1,5}){0,3}"/>
```

as the original line was causing errors in the validation process.