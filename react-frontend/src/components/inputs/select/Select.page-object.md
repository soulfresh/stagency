## Functions

* [getSelectMenuByTrigger([container], element, [options])](#getSelectMenuByTrigger) ⇒ <code>HTMLElement</code>
* [getSelectMenuByTriggerText([container], text, [options])](#getSelectMenuByTriggerText) ⇒ <code>HTMLElement</code>
* [getSelectMenuByTriggerTestId(id, [container])](#getSelectMenuByTriggerTestId) ⇒ <code>HTMLElement</code>
* [getSelectMenuOptionByTrigger([container], element, optionText, [options])](#getSelectMenuOptionByTrigger) ⇒ <code>HTMLElement</code>
* [getSelectMenuOptionByTriggerText([container], triggerText, optionText, [options])](#getSelectMenuOptionByTriggerText) ⇒ <code>HTMLElement</code>
* [getSelectMenuOptionByTriggerTestId(id, optionText, [container])](#getSelectMenuOptionByTriggerTestId) ⇒ <code>HTMLElement</code>

<a name="getSelectMenuByTrigger"></a>

## getSelectMenuByTrigger([container], element, [options]) ⇒ <code>HTMLElement</code>
Find the Select menu associated with the given trigger
element. The element passed should be the trigger button
which has an id that matches the aria-labelledby attribute
of the select.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [container] | <code>HTMLElement</code> | An element within which to constrain   searching for the menu element. |
| element | <code>HTMLElement</code> | The trigger button with a valid id. |
| [options] | <code>object</code> |  |

<a name="getSelectMenuByTriggerText"></a>

## getSelectMenuByTriggerText([container], text, [options]) ⇒ <code>HTMLElement</code>
Get the menu element associated with a select trigger by
searching for the given trigger text.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [container] | <code>HTMLElement</code> | An element within which to constrain   searching for the menu element. |
| text | <code>string</code> | The text in the trigger you are looking for. |
| [options] | <code>object</code> |  |

<a name="getSelectMenuByTriggerTestId"></a>

## getSelectMenuByTriggerTestId(id, [container]) ⇒ <code>HTMLElement</code>
Get the menu element associated with a select trigger by
searching for the given trigger's test id.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The test id of the trigger you are looking for. |
| [container] | <code>HTMLElement</code> | An element within which to constrain   searching for the menu element. |

<a name="getSelectMenuOptionByTrigger"></a>

## getSelectMenuOptionByTrigger([container], element, optionText, [options]) ⇒ <code>HTMLElement</code>
Get an option element from the menu associated with
a Select by the trigger element and option text.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [container] | <code>HTMLElement</code> | An element within which to constrain   searching for the menu element. |
| element | <code>HTMLElement</code> | The trigger element for the select |
| optionText | <code>string</code> | The text of the option you want to select   from the menu. |
| [options] | <code>object</code> |  |

<a name="getSelectMenuOptionByTriggerText"></a>

## getSelectMenuOptionByTriggerText([container], triggerText, optionText, [options]) ⇒ <code>HTMLElement</code>
Get an option element from the menu associated with
a Select trigger by the trigger's text and the option text.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [container] | <code>HTMLElement</code> | An element within which to constrain   searching for the menu element. |
| triggerText | <code>string</code> | The text in the trigger you are looking for. |
| optionText | <code>string</code> | The text of the option you want to select   from the menu. |
| [options] | <code>object</code> |  |

<a name="getSelectMenuOptionByTriggerTestId"></a>

## getSelectMenuOptionByTriggerTestId(id, optionText, [container]) ⇒ <code>HTMLElement</code>
Get an option element from the menu associated with
a select trigger by the trigger's test id.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The test id of the trigger you are looking for. |
| optionText | <code>string</code> | The text of the option you want to select   from the menu. |
| [container] | <code>HTMLElement</code> | An element within which to constrain   searching for the menu element. |

