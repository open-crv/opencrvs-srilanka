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

import {
  getNestedFieldValidators,
  placeOfBirthAddressConfiguration
} from '@countryconfig/form/street-address-configuration'
import { emptyMessage } from '@countryconfig/form/v2/utils'
import {
  AddressType,
  ConditionalType,
  defineFormPage,
  field,
  FieldType
} from '@opencrvs/toolkit/events'

const wasMarried = field('marriage.wasMarried').isEqualTo(true)

export const marriage = defineFormPage({
  id: 'marriage',
  title: {
    defaultMessage: 'Details of Marriage',
    description: 'Form section title for marriage details',
    id: 'form.section.marriage.title'
  },
  fields: [
    {
      id: 'marriage.wasMarried',
      type: FieldType.CHECKBOX,
      label: {
        defaultMessage: 'Were parents married?',
        description: 'This is the label for the field',
        id: 'form.section.marriage.field.wasMarried.label'
      }
    },
    {
      id: 'marriage.divider',
      type: FieldType.DIVIDER,
      label: emptyMessage,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: wasMarried
        }
      ]
    },
    {
      id: 'marriage.addressHelper',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Place of marriage',
        description: 'This is the label for the field',
        id: 'form.section.marriage.field.addressHelper.label'
      },
      configuration: { styles: { fontVariant: 'h3' } },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: wasMarried
        }
      ]
    },
    {
      id: 'marriage.placeOfMarriage',
      type: FieldType.ADDRESS,
      label: {
        defaultMessage: 'Place of Marriage',
        description: 'This is the label for the field',
        id: 'form.section.marriage.field.placeOfMarriage.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: wasMarried
        }
      ],
      validation: [
        {
          message: {
            defaultMessage: 'Invalid input',
            description: 'Error message when generic field is invalid',
            id: 'error.invalidInput'
          },
          validator: field(
            'marriage.placeOfMarriage'
          ).isValidAdministrativeLeafLevel()
        },
        ...getNestedFieldValidators(
          'marriage.placeOfMarriage',
          placeOfBirthAddressConfiguration
        )
      ],
      defaultValue: {
        country: 'LKA',
        addressType: AddressType.DOMESTIC
      },
      configuration: {
        streetAddressForm: placeOfBirthAddressConfiguration
      }
    },
    {
      id: 'marriage.dateOfMarriage',
      type: FieldType.DATE,
      label: {
        defaultMessage: 'Date of Marriage',
        description: 'This is the label for the field',
        id: 'form.section.marriage.field.dateOfMarriage.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: wasMarried
        }
      ]
    }
  ]
})
