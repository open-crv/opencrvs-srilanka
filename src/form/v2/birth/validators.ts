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
import { defineFormConditional } from '@opencrvs/toolkit/conditionals'
import { and, field } from '@opencrvs/toolkit/events'

export const MAX_NAME_LENGTH = 32

export const invalidNameValidator = (fieldName: string) => ({
  message: {
    defaultMessage:
      "Input contains invalid characters. Please use only letters (a-z, A-Z), numbers (0-9), hyphens (-) and apostrophes(')",
    description: 'This is the error message for invalid name',
    id: 'error.invalidName'
  },
  validator: and(
    field(fieldName).get('firstname').isValidEnglishName(),
    field(fieldName).get('middlename').isValidEnglishName(),
    field(fieldName).get('surname').isValidEnglishName()
  )
})

export const nationalIdValidator = (fieldId: string) => ({
  message: {
    defaultMessage: 'This should be a valid Sri Lankan NIC',
    description: 'This is the error message for an invalid national ID',
    id: 'error.invalidNationalId'
  },
  validator: defineFormConditional({
    type: 'object',
    properties: {
      [fieldId]: {
        type: 'string',
        pattern: '^([0-9]{9}[vV]?|[0-9]{12})$',
        description: 'Valid Srilanka nic format new and old.'
      }
    }
  })
})

export const farajalandNameConfig = {
  name: {
    firstname: { required: true },
    surname: { required: true }
  },
  maxLength: MAX_NAME_LENGTH
}

export const englishNameConfig = {
  name: {
    firstname: {
      required: true,
      label: {
        defaultMessage: 'First name(s) in English',
        description: 'Label for English first name field',
        id: 'field.name.english.firstname.label'
      }
    },
    surname: {
      required: true,
      label: {
        defaultMessage: 'Last name in English',
        description: 'Label for English last name field',
        id: 'field.name.english.surname.label'
      }
    }
  },
  maxLength: MAX_NAME_LENGTH
}

export const sinhalaNameConfig = {
  name: {
    firstname: {
      required: true,
      label: {
        defaultMessage: 'First name(s) in Sinhala',
        description: 'Label for Sinhala first name field',
        id: 'field.name.sinhala.firstname.label'
      }
    },
    surname: {
      required: true,
      label: {
        defaultMessage: 'Last name in Sinhala',
        description: 'Label for Sinhala last name field',
        id: 'field.name.sinhala.surname.label'
      }
    }
  },
  maxLength: MAX_NAME_LENGTH
}

export const tamilNameConfig = {
  name: {
    firstname: {
      required: true,
      label: {
        defaultMessage: 'First name(s) in Tamil',
        description: 'Label for Tamil first name field',
        id: 'field.name.tamil.firstname.label'
      }
    },
    surname: {
      required: true,
      label: {
        defaultMessage: 'Last name in Tamil',
        description: 'Label for Tamil last name field',
        id: 'field.name.tamil.surname.label'
      }
    }
  },
  maxLength: MAX_NAME_LENGTH
}
