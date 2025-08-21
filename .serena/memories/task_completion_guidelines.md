# Task Completion Guidelines

## When a Task is Completed

### Code Quality Checks
1. **Linting**: Run ESLint to check for code style issues
   ```bash
   npm run lint
   ```

2. **Type Checking**: Ensure TypeScript compilation succeeds
   ```bash
   npx tsc --noEmit
   ```

3. **Build Verification**: Verify the application builds successfully
   ```bash
   npm run build
   ```

### Testing (When Implemented)
1. **Unit Tests**: Run Jest tests for individual components
   ```bash
   npm test
   ```

2. **Integration Tests**: Run full application tests
   ```bash
   npm run test:integration
   ```

### Code Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Tailwind classes are used efficiently
- [ ] No console.log statements in production code
- [ ] Error boundaries are implemented where needed
- [ ] Loading states are handled appropriately
- [ ] Responsive design is maintained
- [ ] Accessibility features are included

### Documentation Updates
- [ ] Update relevant README files if functionality changes
- [ ] Add JSDoc comments for complex functions
- [ ] Update type definitions if APIs change
- [ ] Document any new environment variables

### Performance Considerations
- [ ] Check bundle size hasn't increased significantly
- [ ] Verify no memory leaks in React components
- [ ] Ensure proper component memoization where needed
- [ ] Optimize images and assets

### Deployment Readiness
- [ ] Environment variables are properly configured
- [ ] Database migrations are ready (when backend is implemented)
- [ ] Docker configurations are updated if needed
- [ ] CI/CD pipeline passes all checks

## Security Checklist
- [ ] No sensitive data in client-side code
- [ ] API endpoints are properly secured (when backend is implemented)
- [ ] Input validation is implemented
- [ ] XSS protection is in place
- [ ] CSRF protection is configured

## Notes
- Currently only frontend linting and building can be tested
- Backend and MCP server commands will be available once implemented
- Testing framework not yet configured - will use Jest when implemented