/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */

import { yesNoRadioOptions } from '@countryconfig/form/v2/person'
import { emptyMessage } from '@countryconfig/form/v2/utils'
import { defineFormPage, FieldType } from '@opencrvs/toolkit/events'
import { farajalandNameConfig } from '../../validators'

export const grandfather = defineFormPage({
  id: 'grandfather',
  title: {
    defaultMessage: 'Details of the Grandfather / Great Grandfather',
    description: 'Form section name for grandFather',
    id: 'form.section.grandfather.name'
  },
  fields: [
    {
      id: 'grandFather.bornInSriLanka',
      type: FieldType.RADIO_GROUP,
      options: yesNoRadioOptions,
      label: {
        defaultMessage: 'Was the Grandfather of the child born in Sri Lanka?',
        id: 'form.field.label.grandFatherBornInSriLanka',
        description: 'Grandfather born in Sri Lanka?'
      }
    },
    {
      id: 'grandFather.divider1',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'grandFather.nameHelper',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Grandfather',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.grandFather.field.nameHelper.label'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'grandFather.nameSinhala',
      type: FieldType.NAME,
      required: true,
      configuration: farajalandNameConfig,
      hideLabel: true,
      label: {
        defaultMessage: "Grandfather's name (in Sinhala)",
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.grandFather.field.nameSinhala.label'
      }
    },
    {
      id: 'grandFather.nameTamil',
      type: FieldType.NAME,
      required: true,
      configuration: farajalandNameConfig,
      hideLabel: true,
      label: {
        defaultMessage: "Grandfather's name (in Tamil)",
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.grandFather.field.nameTamil.label'
      }
    },
    {
      id: 'grandFather.yearOfBirth',
      type: FieldType.NUMBER,
      required: true,
      label: {
        defaultMessage: 'Year of birth',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.grandFather.field.yearOfBirth.label'
      }
    },
    {
      id: 'greatGrandFather.bornInSriLanka',
      type: FieldType.RADIO_GROUP,
      options: yesNoRadioOptions,
      label: {
        defaultMessage:
          'If the Grandfather was not born in Sri Lanka, was the Great Grandfather of the child born in Sri Lanka?',
        id: 'form.field.label.greatGrandFatherBornInSriLanka',
        description: 'Great Grandfather born in Sri Lanka?'
      }
    },
    {
      id: 'greatGrandFather.divider2',
      type: FieldType.DIVIDER,
      label: emptyMessage
    },
    {
      id: 'greatGrandFather.nameHelper',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Great Grandfather',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.greatGrandFather.field.nameHelper.label'
      },
      configuration: { styles: { fontVariant: 'h3' } }
    },
    {
      id: 'greatGrandFather.nameSinhala',
      type: FieldType.NAME,
      required: true,
      configuration: farajalandNameConfig,
      hideLabel: true,
      label: {
        defaultMessage: "Great Grandfather's name (in Sinhala)",
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.greatGrandFather.field.nameSinhala.label'
      }
    },
    {
      id: 'greatGrandFather.nameTamil',
      type: FieldType.NAME,
      required: true,
      configuration: farajalandNameConfig,
      hideLabel: true,
      label: {
        defaultMessage: "Great Grandfather's name (in Tamil)",
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.greatGrandFather.field.nameTamil.label'
      }
    },
    {
      id: 'greatGrandFather.yearOfBirth',
      type: FieldType.NUMBER,
      required: true,
      label: {
        defaultMessage: 'Year of birth',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.greatGrandFather.field.yearOfBirth.label'
      }
    },
    {
      id: 'grandFather.divider3',
      type: FieldType.DIVIDER,
      label: emptyMessage
    }
  ]
})
