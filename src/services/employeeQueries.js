import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      employees {
        id
        name
        age
        class
        subjects
        attendance
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: Int!) {
    employee(id: $id) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE_DETAILS = gql`
  query GetEmployeeDetails($id: Int!) {
    employee(id: $id) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $name: String!
    $age: Int!
    $class: String!
    $subjects: String!
    $attendance: Float!
  ) {
    createEmployee(
      name: $name
      age: $age
      class: $class
      subjects: $subjects
      attendance: $attendance
    ) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: Int!
    $name: String
    $age: Int
    $class: String
    $subjects: String
    $attendance: Float
  ) {
    updateEmployee(
      id: $id
      name: $name
      age: $age
      class: $class
      subjects: $subjects
      attendance: $attendance
    ) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: Int!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`; 