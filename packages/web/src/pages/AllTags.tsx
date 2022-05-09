import React, { useState } from 'react'
import { MdSearch as SearchIcon } from 'react-icons/md'
import tw, { styled } from 'twin.macro'
import { Container } from '~~/components/Layout'
import InputAdornment from '~~/components/my-mui/InputAdornment'
import Tag from '~~/components/my-mui/Tag'
import TextField from '~~/components/my-mui/TextField'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAppContext } from '../context/state'
import { useFetchAllTagsQuery } from '../generated/graphql'
import { getErrorMsg } from '../utils/helperFuncs'

const Tags = styled.div(() => [tw`flex mt-4 flex-wrap`])

const TagContainer = styled.div(() => [
  tw`border-gray-400 border-width[1px] border-solid rounded-sm p-2 m-1 min-width[8em]`,
])

const AllTagsPage = () => {
  const { notify } = useAppContext()
  const { data, loading } = useFetchAllTagsQuery({
    onError: (err) => {
      notify(getErrorMsg(err), 'error')
    },
  })

  const [filterInput, setFilterInput] = useState('')

  return (
    <Container>
      <h2 tw="text-xl   font-normal my-2">Tags</h2>
      <p tw="leading-5 text-gray-700 mb-4">
        A tag is a keyword or label that categorizes your question with other,
        similar questions. Using the right tags makes it easier for others to
        find and answer your question.
      </p>
      <TextField
        tag="input"
        value={filterInput}
        placeholder="Filter by tag name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilterInput(e.target.value)
        }
        tw="leading-3"
        InputProps={{
          startAdornment: (
            <InputAdornment tw="text-gray-500 font-size[1.5em]">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {!loading && data && (
        <Tags>
          {data.getAllTags
            .filter((t) =>
              t.tagName.toLowerCase().includes(filterInput.toLowerCase())
            )
            .map((t) => (
              <TagContainer key={t.tagName}>
                <Tag
                  tag="a"
                  label={t.tagName}
                  tw="mb-2"
                  href={`/tags/${t.tagName}`}
                />
                <div tw="mt-2">
                  <span tw="text-xs ">{t.count} question(s)</span>
                </div>
              </TagContainer>
            ))}
        </Tags>
      )}
      {loading && (
        <div style={{ minWidth: '100%' }}>
          <LoadingSpinner />
        </div>
      )}
    </Container>
  )
}

export default AllTagsPage