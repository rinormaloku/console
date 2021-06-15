import * as React from 'react';
import * as _ from 'lodash-es';
import { sortable } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import * as classNames from 'classnames';
import { referenceForModel } from '../module/k8s';
import { DetailsPage, ListPage, Table, TableRow, TableData, RowFunction } from './factory';
import {
  DetailsItem,
  Kebab,
  ResourceLink,
  ResourceSummary,
  SectionHeading,
  detailsPage,
  navFactory,
} from './utils';
import { TenantKind, K8sResourceKindReference } from '../module/k8s';
import { TenantModel } from '../models';

export const TenantReference: K8sResourceKindReference = referenceForModel(TenantModel);

const { common } = Kebab.factory;
const menuActions = [...Kebab.getExtensionsActionsForKind(TenantModel), ...common];

const tableColumnClasses = [
  classNames('col-sm-5', 'col-xs-6'),
  classNames('col-sm-5', 'col-xs-6'),
  classNames('col-sm-2', 'hidden-xs'),
  Kebab.columnClass,
];

const TenantDetails: React.FC<TenantDetailsProps> = ({ obj }) => {
  return (
    <>
      <div className="co-m-pane__body">
        <SectionHeading text='Tenant +' />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary resource={obj}>
              <DetailsItem label="Admins" obj={obj} path="tenant-admins" />
            </ResourceSummary>
          </div>
        </div>
      </div>
    </>
  );
};

export const TenantList: React.FC = (props) => {
  const { t } = useTranslation();
  const TenantTableHeader = () => {
    return [
      {
        title: t('public~Name'),
        sortField: 'metadata.name',
        transforms: [sortable],
        props: { className: tableColumnClasses[0] },
      },
      {
        title: "Admins",
        sortField: 'spec.tenant-admins[0]',
        transforms: [sortable],
        props: { className: tableColumnClasses[1] },
      },
      {
        title: '',
        props: { className: tableColumnClasses[3] },
      },
    ];
  };
  const TenantTableRow: RowFunction<TenantKind> = ({
    obj,
    index,
    key,
    style,
  }) => {
    return (
      <TableRow id={obj.metadata.uid} index={index} trKey={key} style={style}>
        <TableData className={classNames(tableColumnClasses[0], 'co-break-word')}>
          <ResourceLink kind={TenantReference} name={obj.metadata.name}>
          </ResourceLink>
        </TableData>
        <TableData className={classNames(tableColumnClasses[1], 'co-break-word')}>
          {obj.spec.tenantAdmins}
        </TableData>
      </TableRow>
    );
  };
  return (
    <Table
      {...props}
      aria-label="Tenants"
      Header={TenantTableHeader}
      Row={TenantTableRow}
      virtualize
    />
  );
};
TenantList.displayName = 'TenantList';

export const TenantPage: React.FC<TenantPageProps> = (props) => {
  const createProps = {
    to: '/k8s/cluster/' + referenceForModel(TenantModel) + '/~new/form',
  };
  return (
    <ListPage
      {..._.omit(props, 'mock')}
      title="Tenants"
      kind={TenantReference}
      ListComponent={TenantList}
      canCreate={true}
      filterLabel={props.filterLabel}
      createProps={createProps}
      createButtonText="Create tenant"
    />
  );
};

const pages = [navFactory.details(detailsPage(TenantDetails)), navFactory.editYaml()];

export const TenantDetailsPage: React.FC<TenantDetailsPageProps> = (props) => {
  return (
    <DetailsPage {...props} kind={TenantReference} menuActions={menuActions} pages={pages} />
  );
};
TenantDetailsPage.displayName = 'TenantDetailsPage';

export type TenantDetailsProps = {
  obj: any;
};

export type TenantPageProps = {
  filterLabel: string;
};

export type TenantDetailsPageProps = {
  match: any;
};
