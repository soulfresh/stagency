<a id="general-mixin-feel-variations"></a>

# @mixin feel-variations

Render different styles for the Action feel variations.
This mixin renders the content you pass it for each of
the given feel variations. It also passes the name of
the current feel variation to your content "using ($feel)".

+ **Group:** General
+ **Access:** public

## Parameters

|Name|Type|Description|Default|
|:--|:--|:--|:--|
|`$feels`|string\[]|The list of "feel" variatios to generate.|`(primary, success, error, warn)`|

## Contents

+ The content you wish to render for each feel. Use the `using ($feel)` to access the current feel variation.

```css
    @include feel-variations() using ($feel) {
      color: color($feel);
    }
```

## Dependents

+ **@mixin input** Make an element look and feel like an input element.
  When the element has content to display (for example
  an input element has a `value` set), you should add the
  `hasValue` class to the content container so it
  will receive the correct bolded styling.

<a id="general-mixin-active-shadow"></a>

# @mixin active-shadow

Render a shadow behind an element
when it is hovered or active. This is
achieved by attaching an `::after` element
to the element you add the mixin to.
The `::after` element receives the box-shadow
and it's opacity is transitioned as a speed optimization.

+ **Group:** General
+ **Access:** public

## Parameters

|Name|Type|Description|Default|
|:--|:--|:--|:--|
|`$active-class`|**[String](https://sass-lang.com/documentation/values/strings)**|A class name that can be used to show the active-shadow. The class will be "ANDed" to the location you use it.|`active`|
|`$position`|**[String](https://sass-lang.com/documentation/values/strings)**|The `position` value of the element receiving the active shadow effect.|`relative`|

## Contents

+ This will be used as the content of the `::after` element that receives the box-shadow.

<a id="general-mixin-box-shadow-animation"></a>

# @mixin box-shadow-animation

Animate the box shadow of an element on hover or
when the specified active class is set. Animating
box shadow is not very efficiant so it's prefered
you use the `active-shadow` mixin if you can. However,
this is availble for elements that don't support
`:after` content.

+ **Group:** General
+ **Access:** public

## Dependents

+ **@mixin input** Make an element look and feel like an input element.
  When the element has content to display (for example
  an input element has a `value` set), you should add the
  `hasValue` class to the content container so it
  will receive the correct bolded styling.

<a id="general-mixin-input"></a>

# @mixin input

Make an element look and feel like an input element.
When the element has content to display (for example
an input element has a `value` set), you should add the
`hasValue` class to the content container so it
will receive the correct bolded styling.

+ **Group:** General
+ **Access:** public

## Examples

```javascript
<input className={!!value ? 'hasValue' : ''} />
```

## Dependencies

+ **[@mixin box-shadow-animation](#general-mixin-box-shadow-animation)**
+ **[@mixin feel-variations](#general-mixin-feel-variations)**

