import React from 'react';

import OrganizationHomeContainer from '../../components/organizations/homeContainer';
import Checkbox from '../../components/checkbox';
import Radio from '../../components/radio';
import SplitLayout from '../../components/splitLayout';

import ApiMixin from '../../mixins/apiMixin';
import OrganizationState from '../../mixins/organizationState';

import {t} from '../../locale';

const InviteMember = React.createClass({
  mixins: [ApiMixin, OrganizationState],

  getInitialState() {
    return {selectedTeams: new Set(), roleList: [], selectedRole: 'member', email: ''};
  },

  componentDidMount() {
    let {slug} = this.getOrganization();
    this.api.request(`/organizations/${slug}/members/new/`, {
      method: 'GET',
      success: data => {
        console.log(data);
        this.setState({roleList: data.role_list});
      },
      error: err => {}
    });
  },

  submit() {
    let {slug} = this.getOrganization();
    let {selectedTeams, email, selectedRole} = this.state;
    this.api.request(`/organizations/${slug}/members/new/`, {
      method: 'PUT',
      data: {
        email,
        teams: Array.from(selectedTeams.keys()),
        role: selectedRole
      },
      success: this.onSubmitSuccess,
      error: err => {}
    });
  },

  toggleID(id) {
    let {selectedTeams} = this.state;
    this.setState({
      selectedTeams: selectedTeams.has(id)
        ? (selectedTeams.delete(id), selectedTeams)
        : selectedTeams.add(id)
    });
  },
  onSubmitSuccess() {
    let {orgId} = this.props.params;
    // redirect to member page
    window.location.href = `/organizations/${orgId}/members/`;
  },

  renderRoleSelect() {
    let {roleList, selectedRole} = this.state;

    return (
      <div className="new-invite-team">
        <h4>{t('Team') + ':'}</h4>
        <div className="grouping-controls">
          {roleList.map(({role, allowed}, i) => {
            let {desc, name, id} = role;
            console;
            return (
              <div key={id} onClick={() => this.setState({selectedRole: id})}>
                <Radio id={id} value={name} checked={id === selectedRole} readOnly />
                <h4>{name}</h4>
                <p>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  },

  renderTeamSelect() {
    let org = this.getOrganization();
    let {teams} = org;
    let {selectedTeams} = this.state;

    if (teams.length < 2) return null;
    return (
      <div className="new-invite-team">
        <h4>{t('Team') + ':'}</h4>
        <SplitLayout className="grouping-controls">
          {teams.map(({slug, name, id}, i) => (
            <div key={id} onClick={() => this.toggleID(id)}>
              <Checkbox id={id} value={name} checked={selectedTeams.has(id)} />
              <h4>{name}</h4>
              <p>{slug}</p>
            </div>
          ))}
        </SplitLayout>
      </div>
    );
  },

  render() {
    let {orgId} = this.props.params;
    return (
      <OrganizationHomeContainer>
        <a href={`/organizations/${orgId}/members/`}>
          {t('< Back to Members List')}&nbsp;
        </a>
        <h3>{t('Add Member to Organization')}</h3>
        <p>
          {t(
            'Invite a member to join this organization via their email address. If they do not already have an account, they will first be asked to create one.'
          )}
        </p>
        <h4>{t('Email') + ':'}</h4>
        <input
          type="text"
          name="name"
          label="Email"
          value={this.state.email}
          onChange={e => this.setState({email: e.target.value})}
        />
        {this.renderRoleSelect()}
        {this.renderTeamSelect()}
        <button className="btn btn-primary submit-new-team" onClick={this.submit}>
          {t('Add Member')}
        </button>
      </OrganizationHomeContainer>
    );
  }
});

export default InviteMember;