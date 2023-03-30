export const userFormOptions = [
    {
        'header': 'Personal Information',
        'subheader': 'Use a permanent address where you can receive mail.',
        'inputs': [
            {
                'label': 'First name',
                'element': 'input',
                'type': 'text',
                'name': 'first_name',
                'id': 'first_name',
                'autoComplete': 'given-name',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Last name',
                'element': 'input',
                'type': 'text',
                'name': 'last_name',
                'id': 'last_name',
                'autoComplete': 'family-name',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Email address',
                'element': 'input',
                'type': 'text',
                'name': 'email',
                'id': 'email',
                'autoComplete': 'email',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Country',
                'element': 'select',
                'name': 'country',
                'id': 'country',
                'autoComplete': 'country-name',
                'className':'mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Street address',
                'element': 'input',
                'type': 'text',
                'name': 'street_address',
                'id': 'street_address',
                'autoComplete': 'address-line1',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Phone Number',
                'element': 'input',
                'type': 'tel',
                'name': 'phone_number',
                'id': 'phone_number',
                'autoComplete': 'tel',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'City',
                'element': 'input',
                'type': 'text',
                'name': 'city',
                'id': 'city',
                'autoComplete': 'address-level2',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'State / Province',
                'element': 'input',
                'type': 'text',
                'name': 'province_territory',
                'id': 'province_territory',
                'autoComplete': 'address-level1',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'ZIP / Postal code',
                'element': 'input',
                'type': 'text',
                'name': 'postal_code',
                'id': 'postal_code',
                'autoComplete': 'postal-code',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
        ]
    }
]

export const jobFormOptions = [
    {
        'header': 'General Information',
        'subheader': 'Fill General Information',
        'inputs': [
            {
                'label': 'Position Title',
                'element': 'input',
                'type': 'text',
                'name': 'title',
                'id': 'title',
                'autoComplete': 'Title',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Relocation Required',
                'element': 'select',
                'name': 'relocation',
                'id': 'relocation',
                'autoComplete': 'Relocation',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Types',
                'element': 'select',
                'name': 'types',
                'id': 'types',
                'autoComplete': 'Types',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Salary',
                'element': 'input',
                'type': 'number',
                'name': 'salary',
                'id': 'salary',
                'autoComplete': 'salary',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Industry',
                'element': 'select',
                'name': 'industry',
                'id': 'industry',
                'autoComplete': '',
                'className':'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            }
        ]
    },
    {
        'header': 'Job description',
        'subheader': 'Enter the long as short description of the job',
        'inputs' : [
            {
                'label': 'Short description',
                'element': 'input',
                'type': 'text',
                'name': 'short_description',
                'id': 'short_description',
                'autoComplete': 'Short Description',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Apply By Date',
                'element': 'input',
                'type': 'date',
                'name': 'deadline',
                'id': 'deadline',
                'autoComplete': 'deadline',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Description',
                'element': 'textarea',
                'name': 'description',
                'id': 'description',
                'autoComplete': 'description',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
        ]
    },
    {
        'header': 'Company Information',
        'subheader': 'Fill Company Information',
        'inputs' : [
            {
                'label': 'Company name',
                'element': 'input',
                'type': 'text',
                'name': 'company',
                'id': 'company',
                'autoComplete': 'company',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Street Address',
                'element': 'input',
                'type': 'text',
                'name': 'street_address',
                'id': 'street_address',
                'autoComplete': 'street_address',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'City',
                'element': 'input',
                'type': 'text',
                'name': 'city',
                'id': 'city',
                'autoComplete': 'city',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Province',
                'element': 'input',
                'type': 'text',
                'name': 'province_territory',
                'id': 'province_territory',
                'autoComplete': 'province_territory',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Postal Code',
                'element': 'input',
                'type': 'text',
                'name': 'postal_code',
                'id': 'postal_code',
                'autoComplete': 'postal_code',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
        ]
    },
    {
        'header': 'Contact Information',
        'subheader': 'Fill Contact Information',
        'inputs' : [
            {
                'label': 'Contact Email',
                'element': 'input',
                'type': 'text',
                'name': 'contact_email',
                'id': 'contact_email',
                'autoComplete': 'contact_email',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Contact Phone',
                'element': 'input',
                'type': 'text',
                'name': 'contact_phone',
                'id': 'contact_phone',
                'autoComplete': 'contact_phone',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
            {
                'label': 'Website Url',
                'element': 'input',
                'type': 'text',
                'name': 'website_url',
                'id': 'website_url',
                'autoComplete': 'website_url',
                'className': 'mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            },
        ]
    }
]
