import { TakSnav } from '@takkion/ng-components/layout';

export const SIDE_NAV: TakSnav = {
  typeSnavIcons: 'material-icon',
  items: [
    {
      type: 'link',
      name: 'Home',
      icon: 'dashboard',
      url: 'home',
    },
    {
      type: 'dropdown',
      name: 'Seguridad',
      url: 'seg',
      icon: 'shield',

      dropdownLinks: [
        {
          name: 'Gestionar permisos por usuario',
          url: 'gestionar-permisos-usuario',
          urlIsNotAutoCompleted: true,
        },
        {
          name: 'Gestionar permisos por rol',
          url: 'gestionar-permisos-rol',
        },
      ],
    },
    {
      type: 'collection',
      name: 'Hospitalización',
      url: 'hospitalizacion',
      showCollectionContent: false,
      objects: [
        {
          type: 'dropdown',
          name: 'Gestión Clinica',
          url: 'gestion-clinica',
          icon: 'manage_accounts',
          urlIsNotAutoCompleted: true,
          dropdownLinks: [
            {
              name: 'Gestionar areas',
              url: 'gestionar-areas',
              urlIsNotAutoCompleted: true,
            },
            {
              name: 'Administrar gestiones',
              url: 'administrar-gestiones',
            },
            {
              name: 'Gestionar pacientes',
              url: 'gestionar-pacientes',
            },
            {
              name: 'Censo especialidades',
              url: 'censo-especialidades',
            },
            {
              name: 'Tiempos de egresos',
              url: 'tiempos-egresos',
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Dietas',
          url: 'dietas',
          icon: 'restaurant',
          dropdownLinks: [
            {
              name: 'Jornada de dietas',
              url: 'jornada-dietas',
            },
            {
              name: 'Registro Jornada de dietas',
              url: 'registro-jornada-dietas',
            },
            {
              name: 'Facturación dietas',
              url: 'facturacion-dietas',
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Censos',
          url: '',
          urlIsNotAutoCompleted: true,
          icon: 'format_list_bulleted',
          dropdownLinks: [
            {
              name: 'Censo de pacientes',
              url: 'pacientes/censo-pacientes',
            },

            {
              name: 'Censo de camas',
              url: 'camas/censo-camas',
            },
            {
              name: 'Camas disponibles x centros',
              url: 'camas/camas-disponibles',
            },
          ],
        },
      ],
    },
    {
      type: 'collection',
      showCollectionContent: false,
      name: 'Historia Clinica',
      url: 'hcn',
      objects: [
        {
          type: 'dropdown',
          name: 'Balances de Enfermeria',
          url: 'balances-enfermeria',
          icon: 'balance',
          dropdownLinks: [
            {
              name: 'Sabanas UCI',
              url: 'sabanas-uci',
            },
            {
              name: 'Reporte de sabanas',
              url: 'reporte-sabanas',
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Epicrisis',
          url: 'epicrisis',
          icon: 'work_history',

          dropdownLinks: [
            {
              name: 'Desconfirmar epicrisis',
              url: 'desconfirmar-epicrisis',
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Interconsultas',
          url: 'interconsultas',
          icon: 'shuffle',
          dropdownLinks: [
            {
              name: 'Interconsultas pendientes',
              url: 'pendientes',
            },
          ],
        },
      ],
    },
    {
      type: 'collection',
      showCollectionContent: false,
      name: 'Facturación',
      url: 'sln',

      objects: [
        {
          type: 'dropdown',
          name: 'productos',
          url: 'productos',
          icon: 'inventory',
          dropdownLinks: [
            {
              name: 'Cambiar conceptos de facturación',
              url: 'cambiar-conceptos-facturacion',
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Informes Gerenciales',
          url: 'informes-gerenciales',
          icon: 'assessment',
          dropdownLinks: [
            {
              name: 'Facturación periodo',
              url: 'facturacion-periodo',
            },
            {
              name: 'Facturación por terceros',
              url: 'facturacion-terceros',
            },
            {
              name: 'Facturación terceros por centro',
              url: 'terceros-entidad',
            },
            {
              name: 'Estadistico PFGP',
              url: 'estadistico-pfgp',
            },
            {
              name: 'Estadistico de radicación',
              url: 'estadistico-radicacion',
            },
          ],
        },
        {
          type: 'collection',
          showCollectionContent: false,
          name: 'Hospitalización',
          url: 'hospitalizacion',
          objects: [
            {
              type: 'dropdown',
              name: 'Gestión Clinica',
              url: 'gestion-clinica',
              icon: 'manage_accounts',
              dropdownLinks: [
                {
                  name: 'Gestionar areas',
                  url: 'gestionar-areas',
                },
                {
                  name: 'Administrar gestiones',
                  url: 'administrar-gestiones',
                },
                {
                  name: 'Gestionar pacientes',
                  url: 'gestionar-pacientes',
                },
                {
                  name: 'Censo especialidades',
                  url: 'censo-especialidades',
                },
                {
                  name: 'Tiempos de egresos',
                  url: 'tiempos-egresos',
                },
              ],
            },
            {
              type: 'dropdown',
              name: 'Dietas',
              url: 'dietas',
              icon: 'restaurant',
              dropdownLinks: [
                {
                  name: 'Jornada de dietas',
                  url: 'jornada-dietas',
                },
                {
                  name: 'Registro Jornada de dietas',
                  url: 'registro-jornada-dietas',
                },
                {
                  name: 'Facturación dietas',
                  url: 'facturacion-dietas',
                },
              ],
            },
            {
              type: 'dropdown',
              name: 'Censos',
              url: '',
              urlIsNotAutoCompleted: true,
              icon: 'format_list_bulleted',
              dropdownLinks: [
                {
                  name: 'Censo de pacientes',
                  url: 'pacientes/censo-pacientes',
                },

                {
                  name: 'Censo de camas',
                  url: 'camas/censo-camas',
                },
                {
                  name: 'Camas disponibles x centros',
                  url: 'camas/camas-disponibles',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collection',
      showCollectionContent: false,
      name: 'Inventario',
      url: 'inn',
      objects: [
        {
          type: 'dropdown',
          name: 'Suministros',
          icon: 'vaccines',
          url: 'suministros',
          dropdownLinks: [
            {
              name: 'Suministros x pacientes',
              url: 'inn/suministro-pendientes',
              urlIsNotAutoCompleted: true,
            },
            {
              name: 'Suministros x servicios',
              url: 'inn/subgrupo-suministros-pendientes',
              urlIsNotAutoCompleted: true,
            },
            {
              name: 'Modificar suministros recibidos',
              url: 'inn/modificar-suministros-recibidos',
              urlIsNotAutoCompleted: true,
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Central de compras',
          icon: 'shopping_cart',
          url: 'central-compras',
          dropdownLinks: [
            {
              name: 'Gestionar solicitudes',
              url: 'management',
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Recepciones tecnicas',
          icon: 'collections_bookmark',
          url: 'recepciones-tecnicas',
          dropdownLinks: [
            {
              name: 'Gestionar recepciones tecnicas',
              url: 'manage',
            },
          ],
        },
        {
          type: 'dropdown',
          name: 'Documentos',
          icon: 'checklist',
          url: 'documentos',
          dropdownLinks: [
            {
              name: 'Ordenes de despacho pendientes',
              url: 'ordenes-despacho-pendientes',
            },
          ],
        },
      ],
    },
    {
      type: 'collection',
      showCollectionContent: false,
      name: 'Cartera',
      url: 'crn',
      objects: [
        {
          type: 'dropdown',
          name: 'Gestión / conciliación',
          url: 'gestion-conciliacion',
          icon: 'wallet',
          dropdownLinks: [
            {
              name: 'Gestiones de cartera',
              url: 'crn/gestiones-cartera',
              urlIsNotAutoCompleted: true,
            },
            {
              name: 'Gestionar conciliaciones',
              url: 'crn/gestionar-conciliaciones',
              urlIsNotAutoCompleted: true,
            },
          ],
        },
      ],
    },
  ],
};
