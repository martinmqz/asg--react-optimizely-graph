import './App.css';
import { Locales, useStartQuery } from './generated';
import parse from 'html-react-parser'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
 
    let relativePath = window.location.pathname.length > 1 ? window.location.pathname : '/en'
    if(relativePath.endsWith('/')) {
        relativePath = relativePath.substring(0, relativePath.length - 1)
    }
    const urlSegments = relativePath.split('/')
    const language = urlSegments.length == 0 ? 'en' : (urlSegments[0].length > 0 ? urlSegments[0] : (urlSegments.length > 1 ? urlSegments[1] : 'en'))
    const locale = language.replace('-', '_')
    
    const { data } = useStartQuery({ relativePath: relativePath, locale: locale as Locales });
    
    if(data) {
        return (
            <div className="App">
            {
                data?.Content?.items?.map((content, idx) => {
                const siteUrl = content?.Url?.substring(0, content?.Url.length - 1 - (content?.RelativePath?.length ?? 0)) ?? ''
                if(content?.__typename === 'LandingPage') {
                
                    return (
                        <div className="row" key={idx}>
                          <figure className="figure">
                            <img src={siteUrl + content?.HeroImage ?? ''} className="figure-img img-fluid rounded" alt={content?.Title ?? ''}/>
                              <figcaption className="figure-caption">{content?.Title}</figcaption>
                              <figcaption className="text-end">{content?.Subtitle}</figcaption>
                          </figure>

                          <div className="card text-dark bg-light mb-3">
                              <div className="card-header">
                                  {content?.BuyTicketBlock?.Heading}
                              </div>
                              <div className="card-body">
                                  {content?.BuyTicketBlock?.Message}
                              </div>
                          </div>

                          { content?.MainContentArea?.map((mainContentAreaItem, mainContentAreaItemIdx) => {
                            return (
                              <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={mainContentAreaItemIdx}>
                                {(() => {
                                    const contentItem = mainContentAreaItem?.ContentLink?.Expanded
                                    if (contentItem?.__typename === "ContentBlock"){
                                        return (
                                          <div className="card h-100">
                                              <h4 className="mb-3">{contentItem?.Title}</h4>
                                              <div className="card-body">
                                                  <img src={ siteUrl + contentItem?.Image } className="img-fluid rounded-start" alt={ contentItem?.Title ?? '' }/>
                                              </div>
                                              <div className="card-body">
                                                  { parse(contentItem?.Content ?? '') }
                                              </div>
                                          </div>     
                                        )
                                    }
                                    if (contentItem?.__typename === "ImageFile"){
                                        return (
                                          <div className="card h-100">
                                            <div className="card-body">
                                              <img src={ siteUrl + contentItem?.Url} className="img-fluid rounded-start" alt={contentItem?.Url ?? ''}/>
                                            </div>
                                          </div>   
                                        )
                                    }
                                    return (
                                        <div className="card h-100"></div>
                                    )
                                })()}
                            </div>
                            )
                          })}

                          { content._children?.ArtistContainerPage?.items?.map((artistContainerPage, artistContainerPageIdx) => {
                                return (
                                    <div className="row" key={artistContainerPageIdx}>
                                        <div className="text-dark bg-light mb-3">
                                            <div className="card-header">
                                                <h4><a href={ artistContainerPage?.RelativePath ?? "" } >{ artistContainerPage?.Name }</a></h4>
                                            </div>
                                        </div>
                                        
                                        <div className="card text-dark bg-light mb-3">
                                            <div className="card-header">Headlines</div>
                                        </div>
                                        { artistContainerPage?.headlines?.ArtistDetailsPage?.items?.map((artistDetailsPage, artistDetailsPageIdx) => {
                                            return (
                                                     <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={artistDetailsPageIdx}>

                                                        <div className="card h-100">
                                                            <h4 className="mb-3"><a href={artistDetailsPage?.RelativePath ?? ''}>{artistDetailsPage?.ArtistName}</a></h4>
                                                            <div className="card-body">
                                                            { parse(artistDetailsPage?.ArtistDescription ?? '')}
                                                            </div>
                                                        </div>     
                                                    </div>
                                            )
                                        })}                                        
                                    </div>
                                )
                          })}
                        </div>
                    )
                }
                else if (content?.__typename === 'ArtistContainerPage') {
                
                    return (
                        
                        <div className="row" key={idx}>
                            <h3 className="mb-3">{content?.Name}</h3>
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                                <div className="list-group list-group-flush">
                                    <strong className="facet-title">Artist Genre</strong>
                                    <select id='artistGenre' className="form-select">
                                        <option>All</option>
                                        { content.artists?.ArtistDetailsPage?.facets?.ArtistGenre?.map((artistGenreFacet) => {
                                            return (
                                                <option value={artistGenreFacet?.name?.toString()}>
                                                    {artistGenreFacet?.name} ({artistGenreFacet?.count})
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                        
                                <div className="list-group list-group-flush">
                                    <strong className="facet-title">Stage Name</strong>
                                    <select id='stageName' className="form-select">
                                        <option value=''>All</option>
                                        { content.artists?.ArtistDetailsPage?.facets?.StageName?.map((stageNameFacet) => {
                                            return (
                                                <option value={stageNameFacet?.name?.toString()}>
                                                    {stageNameFacet?.name} ({stageNameFacet?.count})
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>

                        { content.artists?.ArtistDetailsPage?.items?.map((artistDetailsPage, artistDetailsPageIdx) => {
                                return (
                                    <div className="card mb-3">
                                        <div className="row g-0" key={artistDetailsPageIdx}>
                                            <div className="col-md-4">
                                                {(() => {
                                                    if (artistDetailsPage?.ArtistPhoto && artistDetailsPage.ArtistPhoto.length > 0){
                                                        return (
                                                            <img src={ siteUrl + artistDetailsPage?.ArtistPhoto } className="img-fluid rounded-start" alt={artistDetailsPage?.ArtistName ?? ''}/>
                                                        )
                                                    }
                                                })()}
                                            </div>
                                            <div className="col-md-8">

                                                <div className="card-body">
                                                    <div className="card-text">{ artistDetailsPage?.ArtistGenre } - { artistDetailsPage?.StageName }</div>
                                                    <h5 className="card-title"><a href={artistDetailsPage?.RelativePath ?? ''}>{artistDetailsPage?.ArtistName}</a></h5>
                                                    <div className="card-text">{ parse(artistDetailsPage?.ArtistDescription ?? '')}</div>
                                                    <p className="card-text"><small className="text-muted">{artistDetailsPage?.PerformanceStartTime} - {artistDetailsPage?.PerformanceEndTime}</small></p>
                                                </div>
                                            </div>
                                        </div>                    
                                    </div>
                                )
                          })}
                        </div>
                    )
                }
                else if (content?.__typename === 'ArtistDetailsPage') {
                
                    return (
                        <div className="row" key={idx}>
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        {(() => {
                                            if (content?.ArtistPhoto && content.ArtistPhoto.length > 0){
                                                return (
                                                    <img src={ siteUrl + content?.ArtistPhoto } className="img-fluid rounded-start" alt={content?.ArtistName ?? ''}/>
                                                )
                                            }
                                        })()}
                                    </div>
                                    <div className="col-md-8">

                                        <div className="card-body">
                                            <div className="card-text">{ content?.ArtistGenre } - { content?.StageName }</div>
                                            <h5 className="card-title"><a href={content?.RelativePath ?? ''}>{content?.ArtistName}</a></h5>
                                            <div className="card-text">{ parse(content?.ArtistDescription ?? '')}</div>
                                            <p className="card-text"><small className="text-muted">{content?.PerformanceStartTime} - {content?.PerformanceEndTime}</small></p>
                                        </div>
                                    </div>
                                </div>                    
                            </div>
                        </div>
                    )
                    }
                })
            }
            </div>
        );
    }
    
    return (
        <div className="App">
            Loading
        </div>
    );
};
 
export default App;