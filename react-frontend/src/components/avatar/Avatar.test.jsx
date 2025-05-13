import React from 'react';
import { render } from '@testing-library/react';

import { ResizeObserver, fake } from '~/test';

import { AvatarPageObject } from './Avatar.page-object';
import { Avatar } from './Avatar.jsx';

describe('Avatar', function() {
  let avatar, picture;

  beforeEach(() => {
    picture = fake.profilePicture();
    avatar = AvatarPageObject()
  })

  describe('with an image', () => {
    beforeEach(() => {
      render(
        <Avatar name="Grumpy Cat" />
      );
    });

    it('should render', async () => {
      await avatar.exists();
      await avatar.has({initials: 'GC'});
    });
  });

  describe('with an image that fails to load', () => {
    xit('should show the initials.', () => {});
    xit('should not show the broken image.', () => {});
  });

  describe('without an image', () => {
    beforeEach(() => {
      render(
        <Avatar name="Grumpy Cat" image={picture} />
      );
    });

    it('should render the profile image.', async () => {
      await avatar.exists();
      await avatar.has({src: picture});
    });
  });

  describe('when labelled', () => {
    beforeEach(() => {
      render(
        <Avatar labelled name="Grumpy Cat" image={picture} />
      );
    });

    it('should render the image.', async () => {
      await avatar.exists();
      await avatar.has({src: picture});
    });

    it('should render the users name.', async () => {
      await avatar.has({label: 'Grumpy Cat'});
    });
  });

  describe('with a title', () => {
    beforeEach(() => {
      render(
        <Avatar name="Grumpy Cat" title="My title, not my name" image={picture} />
      );
    });

    it('should show the title in the label area.', async () => {
      await avatar.has({label: 'My title, not my name'});
    });
  });

  describe('with a title and labelled', () => {
    beforeEach(() => {
      render(
        <Avatar labelled name="Grumpy Cat" title="My title, not my name" image={picture} />
      );
    });

    it('should show the title in the label area.', async () => {
      await avatar.has({label: 'My title, not my name'});
    });
  });

  describe('with a subtitle', () => {
    beforeEach(() => {
      render(
        <Avatar labelled name="Grumpy Cat" subtitle="King of Cats" image={picture} />
      );
    });

    it('should render the title.', async () => {
      await avatar.exists();
      await avatar.has({label: 'Grumpy Cat'});
    });

    it('should render the subtitle.', async () => {
      await avatar.has({subtitle: 'King of Cats'});
    });
  });

  describe('with a tooltip', () => {
    beforeEach(() => {
      render(
        <Avatar
          tooltip
          name="Grumpy Cat"
          image={picture}
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('shoud render the tooltip.', async () => {
      await avatar.exists();
      await avatar.has({tooltip: 'Grumpy Cat'});
    });
  });
});

