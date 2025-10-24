import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Icon } from '@deque/cauldron-react';
import './Note.css';

interface NoteProps {
  variant?: 'info' | 'warning';
  title?: string;
  children?: React.ReactNode;
}

export default function Note({ children, title, variant = 'info' }: NoteProps) {
  const noteTitle = title ?? (variant === 'info' ? 'Note' : 'Warning');
  return (
    <div
      className={classnames('Note', {
        'Note--info': variant === 'info',
        'Note--warning': variant === 'warning'
      })}
    >
      <div className="Note__title">
        <Icon type={variant === 'info' ? 'info-circle-alt' : 'caution'} />{' '}
        {noteTitle}
      </div>
      <div className="Note__content">{children}</div>
    </div>
  );
}
