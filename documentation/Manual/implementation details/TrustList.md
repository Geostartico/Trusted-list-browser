# TrustList

The web site is composed by more component, the main one is the **TrustList**, 
this is rendered by the root of the dom.

It contain three parts:
+ _Header_
+ _ItemViewer_
+ _FilterPane_

## Header

This component contain the title of the page and the possibility to switch between filter tab,
each a filter button is call a callback function in the TrustList that knowing the new filter 
selected will render differently the page

## FilterPane

The purpose of this component is to show each entry in the selected filter,
each entry could be:
+ Selected
+ Selectable
+ Non Selectable

Every time an entry is toggled, a callback function in the TrustList is called 
and it will use the facade to update all the values in the FilterPane and in the ItemViewer

## ItemViewer

This is a recursive component that will show and make interactable the filtered Trusted List,
each entry is expandable to make it possible to see the nested elements.

Eech value will be shown in a different button and only if the attached value _expand_ is true
the childrens will be also rendered inside a different ItemViewer.

## Search

Initially you can see only a little search icon, if this is pressed than an input box will be open,
now the X stand for close the search

Insered some text in the **FilterPane** will be shown only the entries that contain the specified string.
