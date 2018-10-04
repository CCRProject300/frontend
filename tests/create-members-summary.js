import test from 'tape'
import { createMembersStatusStatement } from '../ui/pages/league-members-add.jsx'

test('Should summerise no active members', (t) => {
  t.plan(1)

  const members = [
    {activated: false},
    {activated: false},
    {activated: false}
  ]

  t.equal(createMembersStatusStatement(members), '3 members have been invited, none have accepted')
})

test('Should summerise one active member', (t) => {
  t.plan(1)

  const members = [ {activated: true} ]

  t.equal(createMembersStatusStatement(members), '1 member has been invited, 1 has accepted')
})

test('Should summerise one active member', (t) => {
  t.plan(1)

  const members = [
    {activated: true},
    {activated: true},
    {activated: true}
  ]

  t.equal(createMembersStatusStatement(members), '3 members have been invited, 3 have accepted')
})
