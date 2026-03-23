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
  AddressType,
  and,
  ConditionalType,
  defineFormPage,
  FieldType,
  or,
  TranslationConfig,
  field,
  user
} from '@opencrvs/toolkit/events'
import { not } from '@opencrvs/toolkit/conditionals'
import { createSelectOptions, emptyMessage } from '../../../utils'
import {
  englishNameConfig,
  invalidNameValidator,
  nationalIdValidator,
  sinhalaNameConfig,
  tamilNameConfig
} from '@countryconfig/form/v2/birth/validators'
import { IdType, idTypeOptions } from '../../../person'
import {
  defaultStreetAddressConfiguration,
  getNestedFieldValidators
} from '@countryconfig/form/street-address-configuration'
import {
  getMOSIPIntegrationFields,
  connectToMOSIPIdReader
} from '@countryconfig/form/v2/mosip'

export const InformantType = {
  MOTHER: 'MOTHER',
  FATHER: 'FATHER',
  OTHER: 'OTHER',
  GRANDFATHER: 'GRANDFATHER',
  GRANDMOTHER: 'GRANDMOTHER',
  BROTHER: 'BROTHER',
  SISTER: 'SISTER',
  LEGAL_GUARDIAN: 'LEGAL_GUARDIAN'
} as const
export type InformantTypeKey = keyof typeof InformantType

const PHONE_NUMBER_REGEX = '^0(7|9)[0-9]{8}$'
const informantMessageDescriptors = {
  MOTHER: {
    defaultMessage: 'Mother',
    description: 'Label for option mother',
    id: 'form.field.label.informantRelation.mother'
  },
  FATHER: {
    defaultMessage: 'Father',
    description: 'Label for option father',
    id: 'form.field.label.informantRelation.father'
  },
  GRANDFATHER: {
    defaultMessage: 'Grandfather',
    description: 'Label for option Grandfather',
    id: 'form.field.label.informantRelation.grandfather'
  },
  GRANDMOTHER: {
    defaultMessage: 'Grandmother',
    description: 'Label for option Grandmother',
    id: 'form.field.label.informantRelation.grandmother'
  },
  BROTHER: {
    defaultMessage: 'Brother',
    description: 'Label for option brother',
    id: 'form.field.label.informantRelation.brother'
  },
  SISTER: {
    defaultMessage: 'Sister',
    description: 'Label for option Sister',
    id: 'form.field.label.informantRelation.sister'
  },
  LEGAL_GUARDIAN: {
    defaultMessage: 'Legal guardian',
    description: 'Label for option Legal Guardian',
    id: 'form.field.label.informantRelation.legalGuardian'
  },
  OTHER: {
    defaultMessage: 'Someone else',
    description: 'Label for option someone else',
    id: 'form.field.label.informantRelation.others'
  }
} satisfies Record<keyof typeof InformantType, TranslationConfig>

const birthInformantTypeOptions = createSelectOptions(
  InformantType,
  informantMessageDescriptors
)

export const informantOtherThanParent = and(
  not(
    field('informant.relation').inArray([
      InformantType.MOTHER,
      InformantType.FATHER
    ])
  ),
  not(field('informant.relation').isFalsy())
)

export const informant = defineFormPage({
  id: 'informant',
  title: {
    defaultMessage: "Informant's details",
    description: 'Form section title for informants details',
    id: 'form.section.informant.title'
  },
  fields: [
    {
      id: 'informant.relation',
      type: FieldType.SELECT,
      analytics: true,
      required: true,
      label: {
        defaultMessage: 'Relationship to child',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.informant.field.relation.label'
      },
      options: birthInformantTypeOptions
    },
    {
      id: 'informant.other.relation',
      type: FieldType.TEXT,
      required: true,
      label: {
        defaultMessage: 'Relationship to child',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.informant.field.other.relation.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('informant.relation').isEqualTo(
            InformantType.OTHER
          )
        }
      ],
      parent: field('informant.relation')
    },
    {
      id: 'informant.nationality',
      type: FieldType.COUNTRY,
      required: true,
      label: {
        defaultMessage: 'Nationality',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.person.field.nationality.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: informantOtherThanParent
        }
      ],
      defaultValue: 'LKA',
      parent: field('informant.relation')
    },
    ...getMOSIPIntegrationFields('informant', {
      existingConditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: informantOtherThanParent
        }
      ]
    }),
    connectToMOSIPIdReader(
      {
        id: 'informant.idType',
        type: FieldType.SELECT,
        required: true,
        label: {
          defaultMessage: 'Type of ID',
          description: 'This is the label for the field',
          id: 'event.birth.action.declare.form.section.person.field.idType.label'
        },
        options: idTypeOptions,
        conditionals: [
          {
            type: ConditionalType.SHOW,
            conditional: informantOtherThanParent
          }
        ]
      },
      {
        valuePath: 'data.idType',
        hideIf: ['authenticated'],
        disableIf: ['pending', 'verified']
      }
    ),
    connectToMOSIPIdReader(
      {
        id: 'informant.nid',
        type: FieldType.ID,
        required: true,
        label: {
          defaultMessage: 'ID Number',
          description: 'This is the label for the field',
          id: 'event.birth.action.declare.form.section.person.field.nid.label'
        },
        conditionals: [
          {
            type: ConditionalType.SHOW,
            conditional: and(
              field('informant.idType').isEqualTo(IdType.NATIONAL_ID),
              informantOtherThanParent
            )
          }
        ],
        validation: [
          nationalIdValidator('informant.nid'),
          {
            message: {
              defaultMessage: 'National id must be unique',
              description: 'This is the error message for non-unique ID Number',
              id: 'event.birth.action.declare.form.nid.unique'
            },
            validator: and(
              not(field('informant.nid').isEqualTo(field('mother.nid'))),
              not(field('informant.nid').isEqualTo(field('father.nid')))
            )
          }
        ]
      },
      {
        valuePath: 'data.nid',
        hideIf: ['authenticated'],
        disableIf: ['pending', 'verified']
      }
    ),
    connectToMOSIPIdReader(
      {
        id: 'informant.passport',
        type: FieldType.TEXT,
        required: true,
        label: {
          defaultMessage: 'ID Number',
          description: 'This is the label for the field',
          id: 'event.birth.action.declare.form.section.person.field.passport.label'
        },
        conditionals: [
          {
            type: ConditionalType.SHOW,
            conditional: and(
              field('informant.idType').isEqualTo(IdType.PASSPORT),
              informantOtherThanParent
            )
          }
        ],
        parent: field('informant.relation')
      },
      {
        valuePath: 'data.passport',
        hideIf: ['authenticated'],
        disableIf: ['pending', 'verified']
      }
    ),
    connectToMOSIPIdReader(
      {
        id: 'informant.brn',
        type: FieldType.TEXT,
        required: true,
        label: {
          defaultMessage: 'ID Number',
          description: 'This is the label for the field',
          id: 'event.birth.action.declare.form.section.person.field.brn.label'
        },
        conditionals: [
          {
            type: ConditionalType.SHOW,
            conditional: and(
              field('informant.idType').isEqualTo(
                IdType.BIRTH_REGISTRATION_NUMBER
              ),
              informantOtherThanParent
            )
          }
        ],
        parent: field('informant.relation')
      },
      {
        valuePath: 'data.brn',
        hideIf: ['authenticated'],
        disableIf: ['pending', 'verified']
      }
    ),
    connectToMOSIPIdReader(
      {
        id: 'informant.nameEnglish',
        type: FieldType.NAME,
        required: true,
        configuration: englishNameConfig,
        hideLabel: true,
        label: {
          defaultMessage: "Informant's name in English",
          description: 'This is the label for the field',
          id: 'event.birth.action.declare.form.section.informant.field.nameEnglish.label'
        },
        conditionals: [
          {
            type: ConditionalType.SHOW,
            conditional: informantOtherThanParent
          }
        ],
        validation: [invalidNameValidator('informant.nameEnglish')]
      },
      {
        valuePath: 'data.name',
        disableIf: ['pending', 'verified', 'authenticated']
      }
    ),
    connectToMOSIPIdReader(
      {
        id: 'informant.nameSinhala',
        type: FieldType.NAME,
        required: true,
        configuration: sinhalaNameConfig,
        hideLabel: true,
        label: {
          defaultMessage: "Informant's name in Sinhala",
          description: 'This is the label for the field',
          id: 'event.birth.action.declare.form.section.informant.field.nameSinhala.label'
        },
        conditionals: [
          {
            type: ConditionalType.SHOW,
            conditional: informantOtherThanParent
          }
        ],
        validation: [invalidNameValidator('informant.nameSinhala')]
      },
      {
        valuePath: 'data.name',
        disableIf: ['pending', 'verified', 'authenticated']
      }
    ),
    connectToMOSIPIdReader(
      {
        id: 'informant.nameTamil',
        type: FieldType.NAME,
        required: true,
        configuration: tamilNameConfig,
        hideLabel: true,
        label: {
          defaultMessage: "Informant's name in Tamil",
          description: 'This is the label for the field',
          id: 'event.birth.action.declare.form.section.informant.field.nameTamil.label'
        },
        conditionals: [
          {
            type: ConditionalType.SHOW,
            conditional: informantOtherThanParent
          }
        ],
        validation: [invalidNameValidator('informant.nameTamil')]
      },
      {
        valuePath: 'data.name',
        disableIf: ['pending', 'verified', 'authenticated']
      }
    ),
    {
      id: 'informant.addressDivider1',
      type: FieldType.DIVIDER,
      label: emptyMessage,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: informantOtherThanParent
        }
      ],
      parent: field('informant.relation')
    },
    {
      id: 'informant.addressHelper',
      type: FieldType.PARAGRAPH,
      label: {
        defaultMessage: 'Usual place of residence',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.person.field.addressHelper.label'
      },
      configuration: { styles: { fontVariant: 'h3' } },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: informantOtherThanParent
        }
      ],
      parent: field('informant.relation')
    },
    {
      id: 'informant.address',
      type: FieldType.ADDRESS,
      required: true,
      hideLabel: true,
      label: {
        defaultMessage: 'Usual place of residence',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.person.field.address.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: informantOtherThanParent
        }
      ],
      validation: [
        {
          message: {
            defaultMessage: 'Invalid input',
            description: 'Error message when generic field is invalid',
            id: 'error.invalidInput'
          },
          validator: field('informant.address').isValidAdministrativeLeafLevel()
        },
        ...getNestedFieldValidators(
          'informant.address',
          defaultStreetAddressConfiguration
        )
      ],
      defaultValue: {
        country: 'LKA',
        addressType: AddressType.DOMESTIC,
        administrativeArea: user('primaryOfficeId').locationLevel('district')
      },
      configuration: {
        streetAddressForm: defaultStreetAddressConfiguration
      },
      parent: field('informant.relation')
    },
    {
      id: 'informant.address.divider.end',
      type: FieldType.DIVIDER,
      label: emptyMessage,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: informantOtherThanParent
        }
      ],
      parent: field('informant.relation')
    },
    {
      id: 'informant.phoneNo',
      type: FieldType.PHONE,
      required: false,
      secured: true,
      label: {
        defaultMessage: 'Phone number',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.informant.field.phoneNo.label'
      },
      validation: [
        {
          message: {
            defaultMessage:
              'Must be a valid 10 digit number that starts with 0(7|9)',
            description:
              'The error message that appears on phone numbers where the first two characters must be 07 or 09, and length must be 10',
            id: 'event.birth.action.declare.form.section.informant.field.phoneNo.error'
          },
          validator: or(
            field('informant.phoneNo').matches(PHONE_NUMBER_REGEX),
            field('informant.phoneNo').isFalsy()
          )
        }
      ],
      parent: field('informant.relation')
    },
    {
      id: 'informant.email',
      type: FieldType.EMAIL,
      required: true,
      secured: true,
      label: {
        defaultMessage: 'Email',
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.informant.field.email.label'
      },
      configuration: {
        maxLength: 255
      },
      parent: field('informant.relation')
    }
  ]
})
